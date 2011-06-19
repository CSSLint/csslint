importPackage(java.io);

(function (argsArray) {
    var files    = [],
        exitCode = 0;

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

    var pluckByType = function(messages, type) {
        return messages.filter(function(message) {
            return message.type == type;
        });
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

    files.forEach(function (filename) {
        var input = readFile(filename);
        if (!input) {
            print("csslint: Could not read file data in " + filename + ". Is the file empty?");
            return;
        }

        var result = CSSLint.verify(input);
        var messages = result.messages || [],
            errors,
            warnings;

        if (messages.length > 0) {
            warnings = pluckByType(messages, 'warning');
            errors  = pluckByType(messages, 'error');


            print("\n\n\ncsslint: There are " + errors.length +  " errors and " + warnings.length  +  " warnings in " + filename + ".");

            messages.sort(function (a, b) {
                if (a.rollup && !b.rollup) {
                    return 1;
                } else if (!a.rollup && b.rollup) {
                    return -1;
                } else {
                    return 0;
                }
            });

            messages.forEach(function (message, i) {
                print("\n" + filename);
                if (message.rollup) {
                    print("" + (i+1) + ": " + message.type);
                    print(message.message);
                } else {
                    print("" + (i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col);
                    print(message.message);
                    print(message.evidence);
                }
            });

            if(errors.length > 0) {
                exitCode = 1;
            }

        } else {
            print("csslint: No problems found in " + filename);
        }
    });

    quit(exitCode);

})(Array.prototype.slice.call(arguments));
