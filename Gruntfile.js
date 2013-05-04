module.exports = function(grunt) {

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
                banner: headerComment
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
            all: ["test/*.html"]
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
    grunt.loadNpmTasks("grunt-qunit-istanbul");
    grunt.loadNpmTasks("grunt-bump");
    //grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-contrib-concat");

    // TO RUN BEFORE COMMIT
    // ====================
    grunt.registerTask("quick-build", ["jshint", "csslint"]);

    // Full build without version bump
    grunt.registerTask("build", ["concat", "qunit", "jshint", "csslint", "uglify"]);

    // FOR TRAVIS
    // ==========
    grunt.registerTask("travis", ["qunit", "jshint", "csslint"]);
};