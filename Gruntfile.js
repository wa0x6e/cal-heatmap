module.exports = function(grunt) {

	"use strict";

    var headerComment = "/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today() %>)\n" +
                " *  ---------------------------------------------\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +

                " *  Licensed under the <%= pkg.license %> license\n" +
                " *  Copyright 2014 <%= pkg.author.name %>\n" +
                " */\n";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            lib: {
                src: ["src/<%= pkg.name %>.js"]
            },
            test: {
                options: {
                    jshintrc: "test/.jshintrc"
                },
                src: ["test/test.js", "test/test-amd.js"]
            }
        },
        csslint: {
            base: {
                src: "<%= pkg.name %>.css",
                options: {
                    "known-properties": false,
                    "order-alphabetical": false,
                    "box-sizing": false
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
                puppeteer: {
                    ignoreDefaultArgs: true,
                    args: [
                        "--headless",
                        "--disable-web-security",
                        "--allow-file-access-from-files"
                    ]
                },
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
            },
            test: {
                src: ["test/src/function.js", "test/src/**/*.js"],
                dest: "test/test.js"
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
			scripts: {
				files: "test/src/**/*.js",
				tasks: ["concat:test"],
				options: {
					interrupt: true,
				}
			},
			lint: {
				files: "src/*.js",
				tasks: ["jshint:lib"],
				options: {
					interrupt: true,
				}
			}
		}
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // TO RUN BEFORE COMMIT
    // ====================
    grunt.registerTask("quick-build", ["csslint", "jshint"]);

    // Full build without version bump
    grunt.registerTask("build", ["concat", "qunit", "csslint", "jshint", "uglify"]);

    // FOR TRAVIS
    // ==========
    grunt.registerTask("travis", ["jshint", "csslint"]);
};
