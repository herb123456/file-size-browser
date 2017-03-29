class DeleteFiles {
    constructor () {
        this.deleteFils = require("./deleteFilesData")
    }

    doDelete (main_callback) {
        let fs = require("fs");
        let async = require("async");
        let errs = [];

        async.each(this.deleteFils["files"], function(file, callback) {

            // Perform operation on file here.
            console.log('Processing file ', file);

            fs.unlink(file.absPath, function (err){
                if (err) {
                    console.log(err);
                    errs.push({
                        file: file,
                        err: err
                    });
                }
                callback();
            }.bind(callback).bind(file));

        }, function(err) {
            this.clearDeleteFilesData(errs);
            main_callback(errs);
        }.bind(this));
    }

    clearDeleteFilesData (errs) {
        if (errs === undefined) {
            errs = [];
        }

        let new_data = [];
        for (let index in errs) {
            if (errs.hasOwnProperty(index) && errs[index].file) {
                new_data.push(errs[index].file);
            }
        }

        this.deleteFils["files"] = new_data;
    }
}

module.exports = DeleteFiles;