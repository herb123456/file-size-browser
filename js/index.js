$(function () {
    /**
     * 1. Get disk info using nodejs-disks
     * 2. Get disk name using diskutil command
     * 3. List all disk
     */
    let diskInfo = [];

    const njds = require('nodejs-disks');
    njds.drives(
        function (err, drives) {
            njds.drivesDetail(
                drives,
                function (err, data) {
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
                            let name = "";
                            if (info.length !== 6) {
                                name = "Untitled";
                            } else {
                                name = info[2];
                            }

                            diskInfo.push({
                                total: disk.total,
                                used: disk.used,
                                usedPer: disk.usedPer,
                                name: name
                            });

                            callback();
                        });
                    };
                    async.each(data, getDiskInfo, function (err){
                        // console.log(err);
                        console.log(diskInfo);

                    });
                }
            );
        }
    )
});