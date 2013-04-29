/*
 * Windows Script Host Command Line Interface
 */
/*global ActiveXObject, WScript, Enumerator, cli*/
//TODO: This file needs major cleanup!!!

var wshapi = (function(){
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var shell = WScript.CreateObject("WScript.Shell");
    var finalArgs = [], i, args = WScript.Arguments;

    if (typeof Array.prototype.forEach !== "function") {
        Array.prototype.forEach = function(f,m) {
            for (var i=0, L=this.length; i<L; ++i) {
                f(this[i], i, m);
            }
        };
    }

    if (typeof Array.prototype.filter !== "function") {
        Array.prototype.filter = function(fn /*, thisp*/) {
            if (typeof fn != "function") {
                throw new Error("not a function");
            }
            var res = [], val, thisp = finalArgs[1];
            for (var i = 0, L = this.length; i < L; i++) {
                if (i in this) {
                    val = this[i]; // in case fun mutates this
                    if (fn.call(thisp, val, i, this)){
                        res.push(val);
                    }
                }
            }

            return res;
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this === void 0 || this === null) {
                throw new Error("unknown instance");
            }
            var t = this;
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (finalArgs.length > 0) {
                n = Number(finalArgs[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    function traverseDir(files, path) {
        var filename, folder = fso.GetFolder(path),
            subFlds, fc = new Enumerator(folder.files);

        for (; !fc.atEnd(); fc.moveNext()) {
            filename = fc.item();
            if (/\.css$/.test(filename)) {
                files.push(filename);
            }
        }

        subFlds = new Enumerator(folder.SubFolders);
        for (; !subFlds.atEnd(); subFlds.moveNext()) {
            traverseDir(files, subFlds.item());
        }
    }

    // turn the WScript.Arguments thing into a regular array
    if (args.Length > 0) {
        for (i = 0; i < args.Length; i++) {
            finalArgs.push(args(i));
        }
    }

    return {
        args: finalArgs,
        print: function(s) { WScript.Echo(s);},
        quit: function (v) { WScript.Quit(v);},

        isDirectory: function(name){
            return fso.FolderExists(name);
        },

        getFiles: function(dir){
            var files = [];
            traverseDir(files, dir);
            return files;
        },

        fixFilenames: function(files){
            return files;
        },

        getWorkingDirectory: function() {
            return shell.CurrentDirectory;
        },

        getFullPath: function(filename){
            return fso.GetAbsolutePathName(filename);
        },

        readFile: function(path){
            var forReading = 1;
            var allText;
            try {
                var tf = fso.OpenTextFile(path, forReading);
                allText = tf.ReadAll();
                tf.Close();
            } catch (ex) {
                return "";
            }
            return allText;
        }
    };

}());

cli(wshapi);
