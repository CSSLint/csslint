/*
 * CSSLint Rhino Command Line Interface
 */
/*jshint rhino:true*/
/*global cli, File*/

importPackage(java.io);

cli({
    args: Array.prototype.concat.call(arguments),
    print: print,
    quit: quit,
    
    isDirectory: function(name){
        var dir = new File(name);
        return dir.isDirectory();
    },
    
    getFiles: function(dir){
        var files = [];

        function traverse(dir) {
            var dirList = dir.listFiles();
            dirList.forEach(function (file) {
                if (/\.css$/.test(file)) {
                    files.push(file.toString());
                } else if (file.isDirectory()) {
                    traverse(file);
                }
            });
        }

        traverse(new File(dir));

        return files;    
    },

    getWorkingDirectory: function() {
        return (new File(".")).getCanonicalPath();
    },
    
    getFullPath: function(filename){
        return (new File(filename)).getCanonicalPath();
    },

    readFile: function(filename) {
        try {
            return readFile(filename);
        } catch (ex) {
            return "";
        }
    }
});