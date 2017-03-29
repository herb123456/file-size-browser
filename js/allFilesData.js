allFilesData = {
    currentPath: "",
    pushData: function (path, data) {
        if (this[path] === undefined) {
            this[path] = [];
        }

        this[path].push(data);

        // $(this).trigger("addData", {path: path, data: data})
    },
    getNextDir: function (dirName) {
        let new_path = "";
        if (dirName === "..") {
            let reg = /\/\w*$/;
            new_path = this.currentPath.replace(reg, "");
        } else {
            new_path = this.currentPath.replace(/\/$/, "") + "/" + dirName;
        }

        if (new_path === "") {
            new_path = "/";
        }

        if (this[new_path] === undefined) {
            return this.currentPath;
        }

        this.currentPath = new_path;
        return new_path;
    }
};

module.exports = allFilesData;