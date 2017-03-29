// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.fileListTemplate = "#file-list-template";
window.deleteListTemplate = "#delete-list-template";

$(function (){

    let scanDir = "/";

    let fileList = $("#fileList");
    let delList = $("#deleteList");

    let readFiles = require("./readFiles");
    let fileReader = new readFiles(scanDir);

    let Render = require("./renderer");
    let render = new Render();

    let MadeDraggable = require("./dragdrop");
    let madeDraggable = new MadeDraggable(render);

    let DelFiles = require("./deleteFiles");
    let delFiles = new DelFiles();
    let deleteFilesData = require("./deleteFilesData");

    $(render).on("rendered", function () {
        madeDraggable.made();
    });

    // scan button
    $("#scan_btn").on("click", function (){
        $.LoadingOverlay("show");
        let $btn = $(this).button('loading');

        fileReader.start(function (data){
            render.render("#fileList", fileListTemplate, data);

            $.LoadingOverlay("hide");
            $btn.button("reset");
        });
        //
        // console.log(new Date());
        // let du = require("./du");
        // du("/", function (err, size){
        //     console.log("callback: ", err);
        //     console.log(new Date());
        // });

        // let async = require("async");
        // let fs = require("fs");
        // async.map(['/Users/herb/Desktop/Projects','file2','/Users/herb/Desktop/Projects/test'], fs.stat, function(err, results) {
        //     console.log(err, results);
        // });

        console.log("clicked");
    });

    // change dir
    fileList.on("click", "tr.dir", function (){
        console.log($(this).data("dir-name"));
        let dir_name = $(this).data("dir-name");
        // if (dir_name === "..") {
        //     let reg = /\/\w*$/;
        //     scanDir = scanDir.replace(reg, "");
        // } else {
        //     scanDir = scanDir.replace(/\/$/, "") + "/" + $(this).data("dir-name");
        // }
        //
        // if (scanDir === "") {
        //     scanDir = "/";
        // }
        let new_path = fileReader.allFiles.getNextDir(dir_name);


        console.log(new_path);

        let data = {
            path: new_path,
            files: fileReader.allFiles[new_path]
        };
        render.render(fileList, fileListTemplate, data);
        // fileList.html(Mustache.render(fileListTemplate, data));

    });

    // sort
    fileList.on("click", ".sort-head", function (){
        let sort_by = $(this).data("sort");
        // console.log(sort_by);
        if (sort_by === "folder" ) {
            fileReader.sortByFolder();
        } else {
            fileReader.sortBySize();
        }

        let current_path = fileReader.allFiles.currentPath;

        // console.log(fileReader.allFiles[current_path]);

        let data = {
            path: current_path,
            files: fileReader.allFiles[current_path]
        };
        render.render(fileList, fileListTemplate, data);
        // fileList.html(Mustache.render(fileListTemplate, data));
    });

    // delete files
    delList.on("click", "#delBtn", function (){
        if (!deleteFilesData["files"] || deleteFilesData["files"].length === 0) {
            return;
        }
        let $btn = $(this).button('loading');
        let modal = $("#delConfirmModal");
        modal.modal('toggle');
        modal.on("hide.bs.modal", function (){
            $btn.button("reset");
        });
    });

    $("#confirmDelBtn").on("click", function (){
        $.LoadingOverlay("show");
        delFiles.doDelete(function (errs){
            console.log(errs);
            if (errs.length !== 0) {
                // show alert
                render.render("#delete-error-body", "#delete-error-template", {errors: errs});
                $("#delErrorModal").modal("toggle");
            }

            let delData = {
                files: deleteFilesData["files"]
            };
            render.render(delList, window.deleteListTemplate, delData);

            $("#delConfirmModal").modal("toggle");
            $.LoadingOverlay("hide");
        });
    });

});