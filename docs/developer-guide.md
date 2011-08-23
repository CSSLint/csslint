# CSS Lint Developer Guide

This guide is intended for those who wish to:

* Contribute code to CSS Lint
* Create their own rules for CSS Lint
* Customize a build of CSS Lint

## Getting the source

CSS Lint is hosted at [GitHub][http://www.github.com] and uses [Git][http://git-scm.com/] for source control. In order to obtain the source code, you must first install Git on your system. Instructions for installing and setting up Git can be found at http://help.github.com/set-up-git-redirect.

If you simply want to create a local copy of the source to play with, you can clone the main repository using this command:

    git clone git://github.com/stubbornella/csslint.git
    
If you're planning on contributing to CSS Lint, then it's a good idea to fork the repository. You can find instructions for forking a repository at http://help.github.com/fork-a-repo/. After forking the CSS Lint repository, you'll want to create a local copy of your fork.

## Directory structure

The CSS Lint directory and file structure is as follows:

* `demos` - collection of demos and sample files
* `docs` - the main documentation folder
* `lib` - contains third party libraries for use in the build
* `npm` - files used exclusively with [npm][http://npmjs.org]
* `release` - contains the distributable files from the last official release
  * `docs` - the documentation for this release
  * `npm` - the folder containing all files necessary for publishing to [npm][http://npmjs.org]
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

In order to build CSS Lint, you must first download and install [Ant][http://ant.apache.org]. Ant is a Java-based command line build tool that works with the `build.xml` file found in the root directory. 

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

Most parts of CSS Lint have unit tests associated with them. Unit tests are written using [YUI Test][http://yuilibrary.com/projects/yuitest/] and are required when making contributions to formatters, rules, or the core library.

When you first get the source code, you need to run `ant` once initially to generate all of the code and the tests. Once you've done that, locate the `testrunner.htm` file in the `tests` directory. Load this into any web browser and click the "Run Tests" button. This executes all tests and prints out the results. 

    