module.exports = function(grunt) {

	"use strict";

     var headerComment = "/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today() %>)\n" +
                " *  ---------------------------------------------\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +

                " *  Licensed under the <%= pkg.license %> license\n" +
                " *  Copyright 2013 <%= pkg.author.name %>\n" +
                " */\n";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: ["<%= pkg.name %>.js", "test/test.js", "test/test-amd.js"]
        },
        csslint: {
            base: {
                src: "<%= pkg.name %>.css",
                rules: {
                    "known-properties": false
                }
            }
        },
        uglify: {
            options: {
                banner: headerComment,
                sourceMap: "<%= pkg.name %>.source-map.js"
            },
            base: {
                files: {
                    "<%= pkg.name %>.min.js" : ["<%= pkg.name %>.js"]
                }
            }
        },
        qunit: {
            options: {
                "--web-security": "no",
                coverage: {
                    src: ["src/*.js"],
                    instrumentedFiles: "temp/",
                    htmlReport: "report/coverage",
                    coberturaReport: "report/"
                }
            },
            all: ["test/index-amd.html", "test/index.html"]
        },
        concat: {
            options: {
                banner: headerComment + "\n"
            },
            js: {
                src: ["src/<%= pkg.name %>.js"],
                dest: "<%= pkg.name %>.js"
            }
        }
    });



    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-css");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-concat");

    // TO RUN BEFORE COMMIT
    // ====================
    grunt.registerTask("quick-build", ["csslint", "jshint"]);

    // Full build without version bump
    grunt.registerTask("build", ["concat", "qunit", "csslint", "jshint", "uglify"]);

    // FOR TRAVIS
    // ==========
    grunt.registerTask("travis", ["jshint", "csslint"]);
};
