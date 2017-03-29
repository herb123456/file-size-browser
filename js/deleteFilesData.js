deleteFilesData = {
    pushData: function (data) {
        if (this["files"] === undefined) {
            this["files"] = [];
        }

        this["files"].push(data);

        // $(this).trigger("addData", {path: path, data: data})
    },

    deleteByName: function (name) {
        let item = null;
        this["files"] = $.grep(this["files"], function(value) {
            if (value.name === name) {
                item = value;
                return false;
            }

            return true;
        });

        return item;
    }
};

// $(deleteFilesData).on("addData", function (event, datas){
//     let path = datas["path"],
//         file = datas["data"];
// });

module.exports = deleteFilesData;