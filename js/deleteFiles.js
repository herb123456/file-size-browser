class DeleteFiles {
    constructor () {
        this.deleteFils = require("./deleteFilesData")
        this.errors = [];
    }

    doDelete (main_callback) {
        const fse = require("fs-extra");
        let async = require("async");
        async.each(this.deleteFils["files"], function (file, async_callback) {
            fse.remove(file.absPath, function (err) {
                console.log(this);
                if (err) {
                    this.errors.push({
                        file: file,
                        err: err
                    });
                }
                async_callback();
            }.bind(this));
        }.bind(this), function (err) {
            this.clearDeleteFilesData();
            let errs = this.errors;
            this.errors = [];
            main_callback(errs);

        }.bind(this));

        // let fs = require("fs");
        // let async = require("async");
        // // let errs = [];
        // this.deleteRecursive(this.deleteFils["files"], function () {
        //     main_callback(this.errors);
        // }.bind(this));
        // async.each(this.deleteFils["files"], function(file, callback) {
        //
        //     // Perform operation on file here.
        //     console.log('Processing file ', file);
        //
        //     if (file.isDir) {
        //         this.deleteRecursive(file, function (){
        //             callback();
        //         }.bind(callback));
        //     } else {
        //         fs.unlink(file.absPath, function (err){
        //             if (err) {
        //                 console.log(err);
        //                 this.errors.push({
        //                     file: file,
        //                     err: err
        //                 });
        //             }
        //             callback();
        //         }.bind(this).bind(callback).bind(file));
        //     }
        //
        //
        // }.bind(this), function(err) {
        //     this.clearDeleteFilesData(this.errors);
        //     main_callback(this.errors);
        // }.bind(this));
    }

    // deleteRecursive (files, callback) {
    //     let fs = require("fs");
    //     if (files.constructor.name === "Array") {
    //         async.each(files, function(file, callback) {
    //             this.deleteRecursive(file, callback);
    //         }.bind(this));
    //     } else if (files.constructor.name === "File") {
    //         if (files.isDir) {
    //             let allFilesInDir = require("./allFilesData")[files.absPath];
    //             // delete all files in dir
    //             this.deleteRecursive(allFilesInDir, function (){
    //                 // delete dir
    //                 this.deleteFile(files);
    //             }.bind(this));
    //         } else {
    //             // delete file
    //             this.deleteFile(files);
    //
    //
    //             // fs.unlink(files.absPath, function (err){
    //             //     if (err) {
    //             //         console.log(err);
    //             //         this.errors.push({
    //             //             file: files,
    //             //             err: err
    //             //         });
    //             //     }
    //             // });
    //         }
    //     }
    //     callback();
    // }
    //
    // deleteFile (file) {
    //     if (files.constructor.name === "File") {
    //         let fs = require("fs");
    //         fs.unlink(file.absPath, function (err){
    //             if (err) {
    //                 console.log(err);
    //                 this.errors.push({
    //                     file: files,
    //                     err: err
    //                 });
    //             }
    //         });
    //     }
    // }

    clearDeleteFilesData () {
        // if (this.errs === undefined) {
        //     errs = [];
        // }

        let new_data = [];
        for (let index in this.errors) {
            if (this.errors.hasOwnProperty(index) && this.errors[index].file) {
                new_data.push(this.errors[index].file);
            }
        }

        this.deleteFils["files"] = new_data;
    }
}

module.exports = DeleteFiles;