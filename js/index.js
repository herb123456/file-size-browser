$(function () {
    /**
     * 1. Get boot drive using bless --info --getBoot
     * 2. Get disk info using nodejs-disks
     * 3. Get disk name using diskutil command
     * 4. List all disk
     */

    $.LoadingOverlay("show");
    let Render = require("./renderer");
    let render = new Render();

    // get boot drive
    let command = "/usr/sbin/bless --info --getBoot";
    let bootCmd = require("child_process").spawn(command, [], { shell: true });
    bootCmd.stdout.on("data", function (data){
        // get disk info
        let GetDiskInfo = require("./diskInfo");
        let getDiskInfo = new GetDiskInfo(data.toString());
        getDiskInfo.get(function (diskInfo){
            data = {
                disks: diskInfo
            };
            render.render("#disk-container", "#disk-content-template", data);
            $.LoadingOverlay("hide");
        });
    });

    $("#disk-container").on("click", ".btn-scan", function () {
        const { remote } = require('electron');
        const path = require('path');
        const url = require('url');

        let pathData = $(this).data("path");
        window.searchPath = pathData;

        console.log(`file://${__dirname}/../filelist.html?id=${pathData}`);

        remote.getCurrentWindow().loadURL(`file://${__dirname}/../filelist.html?path=${pathData}`);
    })

    // custom path btn
    $("#disk-container").on("click", "#custom-path-btn", function (){
        let { remote } = require('electron');
        let dialog = remote.require('electron').dialog;

        let path = dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        $("#custom-path-label").text(path[0]);

        $("#custom-path-scan-btn").data("path", path[0]).fadeIn();
    });


});