/*
 * CSSLint Rhino Command Line Interface
 */

importPackage(java.io);

var argsArray = Array.prototype.slice.call(arguments),
    files    = [];

if (argsArray.length === 0) {
    print("Usage: csslint-rhino.js [file|dir]*");
    quit(1);
}

var getFiles  = function (dir) {
    var files = [];

    var traverse = function (dir) {
        var dirList = dir.listFiles();
        dirList.forEach(function (file) {
            if (/\.css$/.test(file)) {
                files.push(file);
            } else if (file.isDirectory()) {
                traverse(file);
            }
        });
    };

    traverse(dir);

    return files;
};

argsArray.forEach(function (arg) {
    var curFile = new File(arg);

    if (!curFile.exists()) {
        print("File or directory '" + arg + "' not found.");
        return;
    }

    if (curFile.isDirectory()) {
        files = files.concat(getFiles(curFile));
    } else {
        files.push(arg);
    }
});

var exitCode = files.some(processFile);
quit(Number(exitCode));
