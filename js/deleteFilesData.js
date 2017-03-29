deleteFilesData = {
    pushData: function (data) {
        if (this["files"] === undefined) {
            this["files"] = [];
        }

        this["files"].push(data);

        // $(this).trigger("addData", {path: path, data: data})
    }
};

// $(deleteFilesData).on("addData", function (event, datas){
//     let path = datas["path"],
//         file = datas["data"];
// });

module.exports = deleteFilesData;