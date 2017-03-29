class File {
    constructor (abspath, size) {
        this.size = parseInt(size);
        this.absPath = abspath;
        // this.splitedPath = this.absPath.split("/");

        this.name = this.getFileName(this.absPath);
        this.path = "";
        if (this.name !== "") {
            this.path = this.absPath.replace("/" + this.name, "");
        }

        if (this.path === "") {
            console.log(this.absPath);
            this.path = "/";
        }

        this.unit = "k";
        this.formatSize = this.getFormatSize(this.size, this.unit);

        this.fs = require("fs");
        this.isDir = this.getIsDir();
    };

    getFileName () {
        let reg = /^.*\/(.*)$/g;
        let regPath = reg.exec(this.absPath);
        let name = "";
        if (regPath !== null) {
            name = regPath[1];
        }

        return name;
    };

    getIsDir () {
        let isDir = false;
        try {
            isDir = this.fs.lstatSync(this.absPath).isDirectory();
        } catch (err) {
            console.log(err, this.absPath);
        }
        return isDir;
    };

    getFormatSize (size, unit) {
        if (unit === "" || unit === undefined) {
            unit = "k";
        }
        if (size < 1024) {
            return size.toFixed(1) + " " + unit;
        } else {
            return this.getFormatSize(size / 1024, this.getNextUnit(unit))
        }
    };

    getNextUnit (unit) {
        if (unit === "" || unit === undefined) {
            return "k";
        }

        switch (unit) {
            case "k":
                return "M";
            case "M":
                return "G";
            case "G":
                return "T";
        }

        return "unknown";
    };

}

module.exports = File;