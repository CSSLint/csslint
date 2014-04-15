/*jshint node:true*/
module.exports = {
    "suites": {
        "config csslintrc override": {
            "args": [
                "--config=.rc1",
                "dir"
            ],
            "expecting": [
                "csslint: No errors in dir/a.css.",
                "csslint: No errors in dir/b.css.",
                0
            ]
        },
        "straight linting": {
            "args": [
                "dir"
            ],
            "expecting": [
                "csslint: There is 1 problem in dir/a.css.",
                "csslint: There is 1 problem in dir/b.css.",
                0
            ]
        },
        "version": {
            "args": [
                "--version"
            ],
            "expecting": [
                "v@VERSION@",
                0
            ]
        }
    },

    "fakedFs": {
        ".rc1": "--ignore=important,ids",
        "dir": {
            "a.css": ".a {color: red!important;}",
            "b.css": "#a {color: red;}"
        },
    }
};
