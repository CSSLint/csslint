/* jshint node:true */

"use strict";

var stub = {
    logbook: function(log) {
        this.logs.push(log);
    },
    readLogs: function() {
        return this.logs.slice();
    },

    getFullPath: function(path) {
        return path;
    },
    getFiles: function(dir) {
        var filesobj = this.fakedFs[dir],
            fileix,
            out = [];
        for (fileix in filesobj) {
            if (filesobj.hasOwnProperty(fileix) && /\.css$/.test(fileix)) {
                out.push(dir + "/" + fileix);
            }
        }
        return out;
    },
    readFile: function(path) {
        var spath = path.split("/"),
            spathLen = spath.length,
            i,
            out = this.fakedFs;

        for (i = 0; i < spathLen; i += 1) {
            out = out[spath[i]];
        }

        return out;
    },
    isDirectory: function(checkit) {
        var result = this.fakedFs[checkit];
        return typeof result === "object";
    },
    print: function(msg) {
        this.logbook(msg);
    },
    quit: function(signal) {
        this.logbook(signal);
    }
};

module.exports = function(setup) {
    var api,
        setix;

    api = Object.create(stub);

    for (setix in setup) {
        if (setup.hasOwnProperty(setix)) {
            api[setix] = setup[setix];
        }
    }

    api.logs = [];
    return api;
};
