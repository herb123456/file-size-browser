class ReadFiles {
    constructor (path) {
        this.path = path;
        this.allFiles = require("./allFilesData");
        this.excludeDir = [
            "Volumes",
            "System",
            "private",
            ".Trashes",
            ".Spotlight-V100",
            ".fseventsd",
            ".DocumentRevisions-V100"
        ];
    }

    start (callback) {
        console.log(new Date());
        let File = require("./File");

        let spawn = require("child_process").spawn;
        let command = "du -akH -I " + this.excludeDir.join(" -I ") + " " + this.path;
        console.log(command);
        // let du = spawn('du', ['-akH', '-I /Volumes', this.path]);
        let du = spawn(command, [], { shell: true });

        let rl = require('readline');
        let lineReader = rl.createInterface(du.stdout, du.stdin);
        let errReader = rl.createInterface(du.stderr, du.stdin);


        let stdoutHandler = function (data) {
            // console.log(data);
            let datas = data.split("\t");

            if (datas[1] === "/") {
                return;
            }

            let size = datas[0];
            let file = new File(datas[1], size);
            this.addToFileList(file);
        }.bind(this);
        lineReader.on('line', stdoutHandler);

        let errHandler = function (data) {
            let datas = data.split(":");

            // console.log(datas);

            var Sudoer = require('electron-sudo').default;
            var options = {name: 'electron sudo application'},
                sudoer = new Sudoer(options);

            // let cp = sudoer.spawn(
            //     'echo', ['$PARAM'], {env: {PARAM: 'VALUE'}}
            // );
            // cp.on('close', () => {
            //     /*
            //      cp.output.stdout (Buffer)
            //      cp.output.stderr (Buffer)
            //      */
            // });

            // sudoer.spawn('ls', ['/']).then(function (cp) {
            //     /*
            //      cp.output.stdout (Buffer)
            //      cp.output.stderr (Buffer)
            //      */
            //     console.log(cp.output.stdout);
            //     cp.stdout.on('data', (msg) => {
            //         console.log('Looks like we have a message on STDOUT');
            //         console.log(msg.toString('utf8'));
            //     });
            //
            //     cp.stderr.on('data',(err) => {
            //         console.log('Looks like we have a message on STDERR');
            //         console.log(err.toString('utf8'));
            //     });
            //
            //     cp.on('close',() => {
            //         console.log('Processed Finished!');
            //     });
            // });
            //
            // sudoer.spawn('du', ['-ar', datas[1].trim() ]).then(function (du) {
            //     /*
            //      cp.output.stdout (Buffer)
            //      cp.output.stderr (Buffer)
            //      */
            //     console.log(du.output.stderr);
            //     du.stdout.on("data", function (dd){
            //         console.log(dd)
            //     });
            // });

        }.bind(this);
        errReader.on("line", errHandler);

        let closeHandler = function () {
            console.log(this.allFiles);

            this.sortBySize();

            this.allFiles.currentPath = this.path;

            let data = {
                path: this.path,
                pathSize: 1234,
                files: this.allFiles[this.path]
            };
            callback(data);

            console.log(new Date());

            // fileList.html("");
            // fileList.append(Mustache.render(fileListTemplate, data));

            // madeDraggable();
        }.bind(this);
        lineReader.on("close", closeHandler);
    }

    addToFileList (file) {
        if (file.constructor.name !== "File") {
            return ""
        }

        if (this.allFiles[file.path] === undefined) {
            this.allFiles[file.path] = [];
        }

        this.allFiles[file.path].push(file);
    }

    sortBySize () {
        for (let path in this.allFiles) {
            if (this.allFiles.hasOwnProperty(path) && this.allFiles[path].constructor.name === "Array") {
                this.allFiles[path].sort(function (a, b){
                    return b.size - a.size;
                });
            }
        }
    }

    sortByFolder () {
        for (let path in this.allFiles) {

            if (this.allFiles.hasOwnProperty(path) && this.allFiles[path].constructor.name === "Array") {
                this.allFiles[path].sort(function (a, b){
                    if (a.isDir === true && b.isDir === false) {
                        return -1;
                    } else if (a.isDir === false && b.isDir === true) {
                        return 1;
                    } else  {
                        return 0;
                    }
                });
            }
        }
    }
}

module.exports = ReadFiles;