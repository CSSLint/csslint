# Command-line Interface

CSS Lint can be run on the command line so you can incorporate it into your build system. There are two CLIs currently available: one for Node.js and one for Rhino. The functionality of the CLI utilities are exactly the same, the only difference is the JavaScript engine used.

## Running on Node.js

To run CSS Lint on Node.js, you must have npm installed. If npm is not installed, follow the instructions here: http://npmjs.org/

Once npm is installed, run the following

    npm install -g csslint
    
This installs the CSS Lint CLI from the npm repository. To run CSS Lint, use the following format:

    csslint [options] [file|dir]*
    
Such as:

    csslint file1.css file2.css
    

## Running on Rhino

To run on Rhino, first download the Rhino JAR file from http://www.mozilla.org/rhino/. The recommended minimum version number is 1.6. 

Next, download the latest csslint-rhino.js file from http://github.com/stubbornella/csslint/master/release/

To run CSS Lint, use the following format:

    java -jar js.jar csslint-rhino.js [options] [file|dir]*

Such as:

    java -jar js.jar csslint-rhino.js file1.css file2.css
    
### Prettier Syntax

It's recommended to create a shell script to wrap the CSS Lint functionality so you can use the same syntax as the Node.js CLI. 

For Windows, create a file named `csslint.bat` and add the following to the file:

    @echo off
    java -jar js.jar csslint-rhino.js %*
    
For Linux/Mac, create a file named `csslint` and add the following to the file:

    #!/bin/bash
    java -jar js.jar csslint-rhino.js $@
    
After creating the file, you need to ensure it can be executed, so go to the command line and type:

    chmod +x csslint
    
For all systems, you need to make sure that the shell script exists in the same directory as the Rhino JAR file and the `csslint-rhino.js` file, otherwise you'll need to change the files according to where those are located.

Once these steps are complete, you should be able to execute CSS Lint by using the same format as the Node.js CLI.

## Options

You can run CSSLint on a file with:

    csslint [options] path/to/file.css

You can see usage:

    csslint --help

You can customize which rules are applied with the `--rules` option (default is all rules):

    csslint --rules=adjoining-classes,other-rule file.css

You can customize the output format with the `--format` option ("text", "compact", "checkstyle-xml", and "lint-xml" are available):

    csslint --format=lint-xml file.css

You can check the version of CSSLint with:

    csslint --version