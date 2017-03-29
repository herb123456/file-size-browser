class MadeDragAndDrop {
    constructor (render) {
        this.fileList = $("#fileList");
        this.deleteList = $("#deleteList");
        this.overColor = "rgba(208, 213, 214, 0.2)";
        this.allFilesData = require("./allFilesData");
        this.deleteFilesData = require("./deleteFilesData");
        this.render = render;
    }

    made () {
        this.dragFileToDelete();
        this.dragDeleteToFiles();
    }

    dragFileToDelete () {
        // Drag file to delete area
        this.fileList.find("tr:not(.previous)").draggable({
            appendTo: "body",
            cursorAt: { right: -10, top: 15 },
            helper: function (){
                let $this = $(this);
                // console.log();
                return $("<div></div>").append($this.find("td").first().clone().text());
            }
        });

        this.deleteList.droppable({
            accept: "#fileList tr",
            over: function (event, ui){
                $(event.target).css("background-color", this.overColor);
            }.bind(this),
            out: function (event, ui) {
                $(this).css("background-color", "white");
            },
            drop: function (event, ui) {
                let currPath = $("#currPath").text();
                let fileName = ui.helper[0].innerText;

                this.allFilesData[currPath] = $.grep(this.allFilesData[currPath], function(value) {
                    if (value.name !== fileName) {
                        return true;
                    }

                    this.deleteFilesData.pushData(value);

                    return false;
                }.bind(this));

                this.renderList(currPath);

                // console.log(event, ui);
                $(event.target).css("background-color", "white");
            }.bind(this)
        });
    }

    dragDeleteToFiles () {
        // Drag delete file to file list
        this.deleteList.find("tr").draggable({
            appendTo: "body",
            cursorAt: { right: -10, top: 15 },
            helper: function (){
                let $this = $(this);
                // console.log();
                return $("<div></div>").append($this.find("td").first().clone().text());
            }
        });

        this.fileList.droppable({
            accept: "#deleteList tr",
            over: function (event, ui){
                $(event.target).css("background-color", this.overColor);
            }.bind(this),
            out: function (event, ui) {
                $(this).css("background-color", "white");
            },
            drop: function (event, ui) {
                let currPath = $("#currPath").text();
                let filePath = $(ui.draggable[0]).data("path");
                let fileName = ui.helper[0].innerText;

                // delete item from deleteFilesData
                let file = this.deleteFilesData.deleteByName(fileName);
                if (file !== null) {
                    // add to allFilesData
                    this.allFilesData.pushData(filePath, file);
                }

                this.renderList(currPath);

                $(event.target).css("background-color", "white");
            }.bind(this)
        });
    }

    renderList (currPath) {
        this.renderFilelist(currPath);
        this.renderDeleteList();
    }

    renderFilelist (currPath) {
        if (currPath === "" || currPath === undefined) {
            return;
        }

        let listData = {
            path: currPath,
            files: this.allFilesData[currPath]
        };
        this.render.render(this.fileList, window.fileListTemplate, listData);
    }

    renderDeleteList () {
        let delData = {
            files: this.deleteFilesData["files"]
        };
        this.render.render(this.deleteList, window.deleteListTemplate, delData);
    }
}


module.exports = MadeDragAndDrop;