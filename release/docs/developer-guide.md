# CSS Lint Developer Guide

This guide is intended for those who wish to:

* Contribute code to CSS Lint
* Create their own rules for CSS Lint
* Customize a build of CSS Lint

## Getting the source

CSS Lint is hosted at [GitHub](http://www.github.com) and uses [Git](http://git-scm.com/) for source control. In order to obtain the source code, you must first install Git on your system. Instructions for installing and setting up Git can be found at http://help.github.com/set-up-git-redirect.

If you simply want to create a local copy of the source to play with, you can clone the main repository using this command:

    git clone git://github.com/stubbornella/csslint.git
    
If you're planning on contributing to CSS Lint, then it's a good idea to fork the repository. You can find instructions for forking a repository at http://help.github.com/fork-a-repo/. After forking the CSS Lint repository, you'll want to create a local copy of your fork.

## Directory structure

The CSS Lint directory and file structure is as follows:

* `demos` - collection of demos and sample files
* `docs` - the main documentation folder
* `lib` - contains third party libraries for use in the build
* `npm` - files used exclusively with [npm](http://npmjs.org)
* `release` - contains the distributable files from the last official release
  * `docs` - the documentation for this release
  * `npm` - the folder containing all files necessary for publishing to [npm](http://npmjs.org)
* `src` - the main source code folder
  * `cli` - files for the command line interfaces
  * `core` - core CSS Lint functionality including the `CSSLint` object
  * `formatters` - contains files defining the formatters
  * `rules` - contains files defining the CSS Lint rules
  * `workers` - contains files for the CSS Lint Web Worker
* `tests` - the main unit test folder
  * `core` - tests for core CSS Lint functionality including the `CSSLint` object
  * `formatters` - tests for the formatters
  * `rules` - tests for the CSS Lint rules

The first time you run a build, you'll also notice a `build` directory is created. This directory is not checked in and has the same structure as the `release` directory. 

## The build system

CSS Lint uses a build system to make updating code faster and easier. Doing so allows a simple, clean directory and file structure that is easy to navigate and expand upon without needing to reference dozens of JavaScript files in a page. Understanding the build system is key to working with the CSS Lint source code.

### Installing Ant

In order to build CSS Lint, you must first download and install [Ant](http://ant.apache.org). Ant is a Java-based command line build tool that works with the `build.xml` file found in the root directory. 

If you're using Mac OS X, Ant is already installed for you. If for some reason it's not installed, be sure to install MacPorts and run:

    sudo port install apache-ant

If you're using Ubuntu, you can simply type:

    sudo apt-get install ant
    
Other operating systems should refer to http://ant.apache.org/manual/install.html for more information.

### The build targets

Ant works by defining build targets. A target is really just a collection of steps to take. CSS Lint has several build targets:

* `build.core` - builds the core CSS Lint JavaScript library
* `build.worker` - builds the CSS Lint JavaScript Web Worker
* `build.rhino` - builds the CSS Lint JavaScript CLI for Rhino
* `build.node` - builds the CSS Lint JavaScript CLI for Node.js
* `build.tests` - combines all unit tests into a single file
* `build.docs` - processes the documentation files and places them in the `build` directory
* `build.all` - executes all of the previous targets (those beginning with `build.`)
* `changelog.update` - automatically updates the `CHANGELOG` file with change information (admin use only)
* `release` - prepares an official release by inputting version numbers and copying files to `release` directory (admin use only)
* `parser.update` - downloads the latest version of the CSS parser and installs it in the `lib` directory

In order to run a particular target, go into the `csslint` directory and use the following command:

    ant <target>
    
For instance, if you just want to build the tests, run this:

    ant build.tests
    
If you want to build everything, type:

    ant build.all
    
Since `build.all` is the default target, you can shorten this by simply typing:

    ant
    
When there is no target specified on the command line, Ant will automatically use the default.  `build.all` is the most frequently run target so it is set as the default.

Note: It's important that you run this command only in the `csslint` directory. Builds do not work in subdirectories.

### The build.xml file

Ant uses the `build.xml` to define targets and other related information. In general, you won't ever need to touch this file unless you're creating a new build target. 

The property `csslint.version` is defined at the top of the file. This version number is embedded in the source files when the `release` target is run. This value should not be changed except by the CSS Lint maintainers.

### Workflow

Whenever you make changes to the CSS Lint source files, you'll need to run the `build.all` target to regenerate the combined source files. The workflow is:

1. Make changes
1. Run `ant`
1. Verify changes and run tests

## Running unit tests

Most parts of CSS Lint have unit tests associated with them. Unit tests are written using [YUI Test](http://yuilibrary.com/projects/yuitest/) and are required when making contributions to formatters, rules, or the core library.

When you first get the source code, you need to run `ant` once initially to generate all of the code and the tests. Once you've done that, locate the `testrunner.htm` file in the `tests` directory. Load this into any web browser and click the "Run Tests" button. This executes all tests and prints out the results. 

## Working with rules

Each CSS Lint rule has two files: a source file in the `src/rules` directory and a test file in the `tests/rules` directory. The basic source code format for a rule is:

    CSSLint.addRule({

        //rule information
        id: "rule-id",
        name: "Rule name",
        desc: "Short description of rule",
        browsers: "Affected browsers",

        //initialization
        init: function(parser, reporter){
            var rule = this;
            
            //rule initialization
            
        }

    });
    
Each rule is represented by a single object with several properties and one method. The properties are:

* `id` - the rule ID. This must be unique across all rules and must also be the name of the JavaScript file. This rule ID is used to configure CSS Lint on the command line as well as used in JavaScript to configure which rules CSS Lint uses.
* `name` - a human readable name for the rule. This is used in the web UI to describe the rule.
* `desc` - a human readable description for the rule. This is used in the web UI to describe the rule as well as on the command line when all rules are listed out.
* `browsers` - a simple string describing which browsers this rule applies to. By default, use "All". If something is specific to a browser, put that in, such as "IE6".

The one method is `init()`, which sets up the rule. This method is passed in two arguments, a CSS parser and a reporter object. The CSS parser is an instance of `parserlib.css.Parser`, which is part of the ParserLib open source library (http://github.com/nzakas/parser-lib/). The parser is event-driven, so you can add listeners for certain events as the CSS is being parsed. This allows you to inspect pieces of the CSS as they occur in the code. Refer to the [ParserLib documentation](https://github.com/nzakas/parser-lib/blob/master/docs/css.md) for more information on the parser API and the various events that are available.

Quite simply, the

    parser.addListener("property", function(event){
    
        var propertyName    = event.property.toString().toLowerCase(),
            value           = event.value.toString(),
            line            = event.line,
            col             = event.col;
            
        switch(propertyName){
            case "width":
                //do something
                break;
                
            case "height":
                //do something
                break;
                
            case "custom-property":
                reporter.warn("Woah! Why are you using custom-property?", line, col, rule);
                break;
        
        }
    
    });
    
There are a few things to note about this event handler. First, it listens for the "property" event, which fires for each property-value pair inside of a CSS rule. The `event` object contains a `property` property that contains an object with the name of the property in the raw form along with its line and column location. There is also a `value` object that contains the value for the property. Every `event` object for every event also has a `line` and `col` property that gives you basic location information, typically the location of the first part of the pattern that fired the event.

The second object passed to `init()`, the reporter, allows you to publish information to the CSS Lint results. The main method you'll use is `warn()`, which publishes a warning. This method accepts four arguments: a message to display, a line number, a column number, and the rule object itself. For example:

    reporter.warn("This is unexpected!", 1, 1, rule);
    
The line and column number can be accessed from the parser object events, and these help the CSS Lint UI to display the warnings correctly. The last argument, the rule, gives reference information to CSS Lint about the warning so that the UI can display appropriate descriptions of the warnings.

### Rule writing tips

* When looking at a property name, always normalize by transferring to lowercase before comparing. The parser always presents the property in the way it was originally in the code. 
* The `property` event can fire after a `startrule` event, but also after other events such as `startfontface`. This is because CSS properties are used in many places aside from regular CSS rules. They may be used in font-faces, animation keyframes, etc. Due to this, it's recommended:
  * If you're listening for the `startrule` event, also listen to `startfontface`, `startpage`, `startpagemargin`, and `startkeyframes`.
  * If you're listening for the `endrule` event, also listen to `endfontface`, `endpage`, `endpagemargin`, and `endkeyframes`.
