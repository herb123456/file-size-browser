class GetDiskInfo {
    constructor (boot_drive) {
        this.boot_drive = boot_drive;
        this.diskInfo = require("./diskInfoData");
        if (!this.diskInfo[0]) {
            this.diskInfo[0] = boot_drive;
        }
    }

    get (callback) {
        const njds = require('nodejs-disks');

        if (typeof this.diskInfo[0] === "string") {
            njds.drives(
                function (err, drives) {
                    njds.drivesDetail(drives, function (err, data){
                        this.driveDetailCallback(err, data, callback);
                    }.bind(this));
                }.bind(this)
            )
        }

    }

    driveDetailCallback (err, data, callback) {
        const async = require("async");
        let getDiskInfo = function (disk, callback) {
            let spawn = require("child_process").spawn;
            let drive_split = disk.drive.split("/");
            let drive_name = drive_split[drive_split.length - 1];
            // console.log(drive_name);
            let command = "diskutil list | grep "+ drive_name;
            let diskutil = spawn(command, [], { shell: true });
            diskutil.stdout.on ('data', (data) => {
                let info = data.toString ().split(" ").filter(function (n) {return n !== ""});
                // console.log(disk, info);
                let name = "";
                if (info.length !== 6) {
                    name = "Untitled";
                } else {
                    name = info[2];
                }

                console.log(disk);
                if (disk.drive.trim() === this.boot_drive.trim()) {
                    this.diskInfo[0] = {
                        total: disk.total,
                        used: disk.used,
                        usedPer: disk.usedPer,
                        name: name,
                        mountpoint: disk.mountpoint
                    };
                } else {
                    this.diskInfo.push({
                        total: disk.total,
                        used: disk.used,
                        usedPer: disk.usedPer,
                        name: name,
                        mountpoint: disk.mountpoint
                    });
                }



                callback();
            });
        }.bind(this);
        async.each(data, getDiskInfo, function (err){
            // console.log(err);
            // console.log(this.diskInfo);


            callback(this.diskInfo)
        }.bind(this));

    }
}

module.exports = GetDiskInfo;