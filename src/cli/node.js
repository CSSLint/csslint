/*
 * CSSLint Node.js Command Line Interface
 */

/*jshint node:true*/
/*global cli*/

var fs      = require("fs"),
    path    = require("path"),
    CSSLint = require("./lib/csslint-node").CSSLint;
    
cli({
    args: process.argv.slice(2),

    print: function(message){
        fs.writeSync(1, message + "\n");
    },
    
    quit: function(code){
    
        //Workaround for https://github.com/joyent/node/issues/1669
        if (!process.stdout.flush || !process.stdout.flush()) {
            process.once("drain", function () {
                process.exit(code || 0);
            });
        } else {
            process.exit(code || 0);
        }
    },
    
    isDirectory: function(name){
        return fs.statSync(name).isDirectory();
    },

    getFiles: function(dir){
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
                
                if (file[0] == ".") {
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
        return process.cwd();
    },
    
    getFullPath: function(filename){
        return path.resolve(process.cwd(), filename);
    },

    readFile: function(filename){
        return fs.readFileSync(filename, "utf-8");    
    }
});

