/*
 * CSSLint Node.js Command Line Interface
 */

/* jshint node:true */
/* global cli */
/* exported CSSLint */

var fs      = require("fs"),
    path    = require("path"),
    CSSLint = require("./lib/csslint-node").CSSLint;

cli({
    args: process.argv.slice(2),

    print: function(message){
        "use strict";
        fs.writeSync(1, message + "\n");
    },

    quit: function(code){
        "use strict";
        process.exit(code || 0);
    },

    isDirectory: function(name){
        "use strict";
        try {
            return fs.statSync(name).isDirectory();
        } catch (ex) {
            return false;
        }
    },

    getFiles: function(dir){
        "use strict";
        var files = [];

        try {
            fs.statSync(dir);
        } catch (ex){
            return [];
        }

        function traverse(dir, stack){
            stack.push(dir);
            fs.readdirSync(stack.join("/")).forEach(function(file){
                var path = stack.concat([file]).join("/"),
                    stat = fs.statSync(path);

                if (file[0] === ".") {
                    return;
                } else if (stat.isFile() && /\.css$/.test(file)){
                    files.push(path);
                } else if (stat.isDirectory()){
                    traverse(file, stack);
                }
            });
            stack.pop();
        }

        traverse(dir, []);

        return files;
    },

    getWorkingDirectory: function() {
        "use strict";
        return process.cwd();
    },

    getFullPath: function(filename){
        "use strict";
        return path.resolve(process.cwd(), filename);
    },

    readFile: function(filename){
        "use strict";
        try {
            return fs.readFileSync(filename, "utf-8");
        } catch (ex) {
            return "";
        }
    }
});

