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

The command line utility has several options. You can view the options by running `csslint --help`.

    Usage: csslint-rhino.js [options]* [file|dir]*
            
    Global Options
      --help                 Displays this information.
      --rules=<rule[,rule]+> Indicate which rules to include.
      --format=<format>      Indicate which format to use for output.
      --version              Outputs the current version number.

### --help

This option outputs the help menu, displaying all of the available options. When `--help` is entered, all other flags are ignored.

### --rules

This option allows you to specify which rules to run. The rules are represented as a comma-delimited list of rule IDs, such as:

    csslint --rules=box-model,ids test.css
    
This command runs the `box-model` and `id` rules on the file `test.css`. The rule IDs are found in the rules documentation. You can specify as many rules as you like using this option.

When this option is omitted, all rules are executed.

### --format

This options specifies the output format for the console. There are several formats to choose from:

* `text` - the default format
* `compact` - a more condensed output where each warning takes only one line of output
* `lint-xml` - an XML format that can be consumed by other utilities
* `csslint-xml` - same as `lint-xml` except the document element is `<csslint>`
* `checkstyle-xml` - a format appropriate for consumption by [Checkstyle]:[http://checkstyle.sourceforge.net/]

For example:

    csslint --format=lint-xml test.css
    
When specified, the given format is output to the console. If you'd like to save that output into a file, you can do so on the command line like so:

    csslint --format=lint-xml test.css > results.xml
    
This saves the output into the `results.xml` file.

### --version

This option outputs the version of CSS Lint that is being used.
