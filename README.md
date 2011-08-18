# CSSLint

CSSLint is a tool to help point out problems with your CSS code. It does basic syntax checking as well as applying a set of rules to the code that look for problematic patterns or signs of inefficiency. The rules are all pluggable, so you can easily write your own or omit ones you don't want.

# Command-line Interface

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

# Contributors

## Creators

1. Nicole Sullivan, http://www.stubbornella.org
1. Nicholas C. Zakas, http://www.nczonline.net

## Contributors

1. Samori Gorse, https://twitter.com/shinuza (Rules, Non-zero Exit Code for CLI)
1. Eitan Konigsburg, https://twitter.com/eitanmk (Rhino CLI)
1. Ben Barber (Compatible Vendor Prefix Rule)
1. Eric Wendelin, http://eriwen.com (Output formatters)
1. Kasper Garnaes, http://reload.dk (Checkstyle XML format)
