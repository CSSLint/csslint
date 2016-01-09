[![npm version](https://img.shields.io/npm/v/csslint.svg)](https://www.npmjs.com/package/csslint)
[![Build Status](https://img.shields.io/travis/CSSLint/csslint/master.svg)](https://travis-ci.org/CSSLint/csslint)
[![Dependency Status](https://img.shields.io/david/CSSLint/csslint.svg)](https://david-dm.org/CSSLint/csslint)
[![devDependency Status](https://img.shields.io/david/dev/CSSLint/csslint.svg)](https://david-dm.org/CSSLint/csslint#info=devDependencies)

# CSSLint

CSSLint is an open source CSS code quality tool originally written by
[Nicholas C. Zakas](http://www.nczonline.net/) and
[Nicole Sullivan](http://www.stubbornella.org/). It was released in June 2011 at
the Velocity conference.

A [lint](http://en.wikipedia.org/wiki/Lint_programming_tool) tool performs
[static analysis](http://en.wikipedia.org/wiki/Static_code_analysis) of source
code and flags patterns that might be errors or otherwise cause problems for the
developer.

CSSLint is a tool to help point out problems with your CSS code. It does basic
syntax checking as well as applying a set of rules to the code that look for
problematic patterns or signs of inefficiency. The rules are all pluggable, so
you can easily write your own or omit ones you don't want.

## Integration

### Command Line Interface

All about the command line interface for CSSLint. If you'd rather use a CLI
program to verify your CSS instead of using the web site, then this guide is
your best friend.
https://github.com/CSSLint/csslint/wiki/Command-line-interface

### Build System

Once you're familiar with the CSSLint command line interface, the next step is
to integrate it into your build system. This guide walks through using CSSLint
as part of your build.
https://github.com/CSSLint/csslint/wiki/Build-System-Integration

### IDE

You can integrate CSSLint into your favorite IDE to make checking your CSS code
quality easy. In fact, some IDEs already have CSSLint built in.
https://github.com/CSSLint/csslint/wiki/IDE-integration

## Rules

Not sure why a rule is important? This guide talks about each of the CSSLint
rules and explains how the rule is designed to improve your CSS.
https://github.com/CSSLint/csslint/wiki/Rules

## Developer Guide

If you want to contribute to the project, or even just tinker on your own,
this guide explains how to get the source and work with it.
https://github.com/CSSLint/csslint/wiki/Developer-Guide

## Contributors

1. Samori Gorse, https://twitter.com/shinuza (Rules, Non-zero Exit Code for CLI)
1. Eitan Konigsburg, https://twitter.com/eitanmk (Rhino CLI)
1. Ben Barber (Compatible Vendor Prefix Rule)
1. Eric Wendelin, http://eriwen.com (Output formatters)
1. Kasper Garnaes, http://reload.dk (Checkstyle XML format)
1. Gord Tanner, http://www.tinyhippos.com (CLI quiet option)
1. Hans-Peter Buniat, https://github.com/hpbuniat (Duplicate background image rule)
1. Dino Chiesa, https://github.com/DinoChiesa (Windows Script Host CLI)
1. Tomasz Oponowicz, https://github.com/tomasz-oponowicz (XML format and CLI fixes)
1. Julien Kernec'h, https://github.com/parallel (Fixed a rule)
1. Cillian de Róiste, https://plus.google.com/116480676247600483573/posts (Node CLI fixes)
1. Damien Sennm, https://github.com/topaxi (README fixes)
1. Jonathan Barnett, http://twitter.com/indieisaconcept (JUnit formatter)
1. Zach Leatherman, http://www.zachleat.com/ (bug fixes)
1. Philip Walton, http://philipwalton.com (Rules fixes, bug fixes)
1. Jeff Beck, http://www.jeffbeck.info (Rules fixes, bug fixes)
1. Jay Merrifield, https://github.com/fracmak (Rules fixes)
1. Michael Mattiacci, http://mattiacci.com (Rules fixes)
1. Jonathan Klein, http://www.jonathanklein.net (Bulletproof font-face rule)
1. Shannon Moeller, http://shannonmoeller.com (Embedded rulesets)
1. Nick Schonning, https://github.com/nschonni (Contributing.md, grunt build)
1. Jared Wyles, https://github.com/jaredwy (Managing pull requests, endless advice)
1. Scott Gonzalez, https://github.com/scottgonzalez (JSON config)
