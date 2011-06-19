#!/usr/bin/env node

/*
 * CSSLint Node.js Command Line Interface
 */
var fs      = require("fs"),
    sys     = require("sys"),
    path    = require("path"),
    CSSLint = require("./lib/csslint-node").CSSLint,
    options = {},
    stdout  = process.stdout;

//-----------------------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------------------

// CSSLint Node.js Writer
var writer = {
    messages: [],
    filename: '',
    content: '<?xml version="1.0" encoding="UTF-8"?><checkstyle version="css-lint">',
    setup: function(messages, filename) {
        this.messages = messages;
        this.filename = filename;
        return this;
    },
    console: function() {
        var _this = this;
        this.messages.forEach(function(message,i){
            stdout.write("\n" + _this.filename + ":\n");
            if (message.rollup){
                stdout.write((i+1) + ": " + message.type + "\n");
                stdout.write(message.message + "\n");
            }
            else {
                stdout.write((i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col + "\n");
                stdout.write(message.message + "\n");
                stdout.write(message.evidence + "\n");
            }
        });
    },
    xml: function(file) {
        var _this = this;
        this.content += "\n" + '<file name="' + this.filename + '">';
        this.messages.forEach(function(message,i) {
            _this.content += "\n" + '<error source="css-lint" severity="' + message.type + '" message="' + message.message;
            if (!message.rollup){
                _this.content += ' (' + message.evidence + ')" line="' + message.line + '" column="' + message.col;
            }

            _this.content += '">';
        });
        this.content += "\n" + '</file>';
    }
};

//get all files in a directory
function getFiles(dir){
    var files = [];

    try {
        fs.statSync(dir);
    } catch (ex){
        return [];
    }

    function traverse(dir, stack){
        stack.push(dir);
        fs.readdirSync(stack.join("/")).forEach(function(file){
            var path = stack.concat([file]).join("/");
            var stat = fs.statSync(path);

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
}

//output CLI help screen
function outputHelp(){
    stdout.write([
        "\nUsage: csslint [file|dir]*",
        " ",
        "Global Options",
        "  --quiet             Do not print the result.",
        "  --xml=file          Write result as checkstyle to file.",
        "  --help              Displays this information."
    ].join("\n") + "\n\n");
}

//-----------------------------------------------------------------------------
// Process command line
//-----------------------------------------------------------------------------

var args    = process.argv.slice(2),
    arg     = args.shift(),
    files   = [];

while(arg){
    if (arg.indexOf("--") == 0){
        if (arg.indexOf("=") !== -1) {
            var t = arg.split('=');
            options[t[0].substring(2)] = t[1];
        }
        else {
            options[arg.substring(2)] = true;
        }
    } else {

        //see if it's a directory or a file
        if (fs.statSync(arg).isDirectory()){
            files = files.concat(getFiles(arg));
        } else {
            files.push(arg);
        }
    }
    arg = args.shift();
}

if (options.help || process.argv.length == 2){
    outputHelp();
    process.exit(0);
}

//get the full path names
files = files.map(function(filename){
    return path.join(process.cwd(), filename);
});

if (options.xml) {
    try { fs.unlinkSync(options.xml); } catch(e) {}
}

//-----------------------------------------------------------------------------
// Loop over files
//-----------------------------------------------------------------------------
files.forEach(function(filepath){
    var text    = fs.readFileSync(filepath,"utf-8"),
        filename= path.basename(filepath),
        result  = CSSLint.verify(text),
        messages= result.messages;

    if (messages.length){
        stdout.write("csslint: There are " + messages.length + " errors and warnings in " + filename + ".\n");

        //rollups at the bottom
        messages.sort(function(a, b){
            if (a.rollup && !b.rollup){
                return 1;
            } else if (!a.rollup && b.rollup){
                return -1;
            } else {
                return 0;
            }
        });

        writer.setup(messages, filename);
        if (options.xml) {
            writer.xml(options.xml);
        }

        if (typeof options.quiet === 'undefined') {
            writer.console();
        }

    } else {
        stdout.write("csslint: No problems found in " + filename + ".\n");
    }
});

if (options.xml) {
    try { fs.writeFileSync(options.xml, writer.content + '</checkstyle>'); } catch(e) {}
}
