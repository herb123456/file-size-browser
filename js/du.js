var fs = require('fs')
    , path = require('path')
    , async = require('async')
    , File = require("./File")

let allFiles = {};

function du (dir, options, callback) {
    if (typeof options === 'function') {
        callback = options
        options  = {}
    }

    fs.lstat(dir = path.resolve(dir), function (err, stat) {
        if (err) return callback(null)

        if (!stat) return callback(null, 0)

        var size = options.disk ? (512 * stat.blocks) : stat.size

        let f = new File(dir, size);
        if ( allFiles[f.path] === undefined) {
            allFiles[f.path] = [];
        }
        allFiles[f.path].push(f);

        if (!stat.isDirectory()){

            return callback(null, f)
        }

        fs.readdir(dir, function (err, list) {
            if (err) {
                // console.log("error!!!!");
                // console.log(callback);
                return callback(null, null);
            }

            // console.log(list.map(function (f) {
            //     return path.join(dir, f)
            // }));

            // let listWithPath = list.map(function (f) {return path.join(dir, f)})
            // async.each(listWithPath, function (path, callback) {
            //
            // });

            async.map(
                list.map(function (f) {
                    return path.join(dir, f)
                })
                , function (f, asyncCallback) {
                    // console.log("f callback: ", callback);
                    return du(f, options, asyncCallback)
                }
                , function (err, res) {
                    // console.log("in map: ", err, res);
                    // console.log(sizes.reduce(function (p, s) {
                    //     console.log(p, s);
                    //     return p + s
                    // }, size));
                    callback(err, allFiles)
                }
            )
        })
    })
}

module.exports = du