/* jshint node:true */
"use strict";

module.exports = function(grunt) {
    grunt.registerMultiTask("changelog", "Write the changelog file", function() {
        var done = this.async();
        var lastTag;
        var files = this.filesSrc;


        grunt.util.spawn({
            cmd: "git",
            args: ["tag"]
        }, function(error, result) {
            // Find the latest git tag
            var tags = result.stdout.split("\n"),
                semver = tags[0].replace("v", "").split("."),
                major = parseInt(semver[0], 10),
                minor = parseInt(semver[1], 10),
                patch = parseInt(semver[2], 10);

            // A simple array sort can't be used because of the comparison of
            // the strings "0.9.9" > "0.9.10"
            for (var i = 1, len = tags.length; i < len; i++) {
                semver = tags[i].replace("v", "").split(".");

                var currentMajor = parseInt(semver[0], 10);
                if (currentMajor < major) {
                    continue;
                } else if (currentMajor > major) {
                    major = currentMajor;
                }

                var currentMinor = parseInt(semver[1], 10);
                if (currentMinor < minor) {
                    continue;
                } else if (currentMinor > minor) {
                    minor = currentMinor;
                }

                var currentPatch = parseInt(semver[2], 10);
                if (currentPatch < patch) {
                    continue;
                } else if (currentPatch > patch) {
                    patch = currentPatch;
                }
            }

            lastTag = "v" + major + "." + minor + "." + patch;

            grunt.verbose.write("Last tag: " + lastTag).writeln();

            grunt.util.spawn({
                cmd: "git",
                args: ["log", "--pretty=format:'* %s (%an)'", lastTag + "..HEAD"]
            }, function(error, result) {
                var prettyPrint = result.stdout.split("'\n'")
                                    .join("\n")
                                    .replace(/"$/, "")
                                    .replace(/^"/, "")
                                    .replace(/^'/, "")
                                    .replace(/'$/, "");

                grunt.verbose.writeln().write(prettyPrint).writeln();

                var template = "<%= grunt.template.today('mmmm d, yyyy') %> - v<%= pkg.version %>\n\n" +
                    prettyPrint + "\n\n" +
                    grunt.file.read(files[0]);

                grunt.file.write(files[0], grunt.template.process(template));

                done();
            });
        });

    });
};
