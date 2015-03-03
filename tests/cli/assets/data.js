/* jshint node:true */

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
        "mix of cli options": {
            "args": [
                "--config=.rc1",
                "--ignore=important",
                "dir"
            ],
            "expecting": [
                "csslint: No errors in dir/a.css.",
                "csslint: There is 1 problem in dir/b.css.",
                0
            ]
        },
        "more mixes of cli options": {
            "args": [
                "--config=.rc1",
                "--errors=important",
                "dir"
            ],
            "expecting": [
                "csslint: There is 1 problem in dir/a.css.",
                "csslint: No errors in dir/b.css.",
                1
            ]
        }
    },

    "fakedFs": {
        ".rc1": "--ignore=important,ids",
        "dir": {
            "a.css": ".a {color: red!important;}",
            "b.css": "#a {color: red;}"
        }
    }
};
