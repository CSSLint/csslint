Steps to run dev version of csslint from the command line (not the current release):

1. command line: "ant"
1. edit /build/npm/package.json give it a version number like 1.0.0
1. command line: "npm link" (in the build/npm dir, possibly sudo)
1. command line: "csslint <options> <file-name>" 