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
                rules: {
                    "known-properties": false,
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
                    "<%= pkg.name %>.min.js" : ["build/<%= pkg.name %>.js"]
                }
            }
        },
        qunit: {
            options: {
                "--web-security": "no",
                coverage: {
                    src: ["build/*.js"],
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
                src: ["build/<%= pkg.name %>.js"],
                dest: "<%= pkg.name %>.js"
            },
            test: {
                src: ["test/src/function.js", "test/src/**/*.js"],
                dest: "test/test.js"
            }
        },
        clean: {
            build: ["build"]
        },
        coveralls: {
            options: {
                coverage_dir: "coverage/"
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
				files: "build/*.js",
				tasks: ["jshint:lib"],
				options: {
					interrupt: true,
				}
			}
		},
        umd: {
            all: {
                options: {
                    src: 'src/cal-heatmap.js',
                    dest: 'build/cal-heatmap.js', // optional, if missing the src will be used
                    //template: 'path/to/template.hbs', // optional, a template from templates subdir
                        // can be specified by name (e.g. 'umd'); if missing, the templates/umd.hbs
                        // file will be used from [libumd](https://github.com/bebraw/libumd)
                    objectToExport: 'CalHeatMap', // optional, internal object that will be exported
                    //amdModuleId: 'id', // optional, if missing the AMD module will be anonymous
                    //globalAlias: 'alias', // optional, changes the name of the global variable
                    indent: 2, // optional (defaults to 2), indent source code. Accepts strings as well
                    deps: { // optional
                        'default': ['d3'],
                        amd: ['d3'],
                        cjs: ['d3'],
                        global: ['d3']
                    }
                }
            }
        }       
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-css");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-karma-coveralls");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-umd");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // TO RUN BEFORE COMMIT
    // ====================
    grunt.registerTask("quick-build", ["clean:build","csslint", "jshint"]);

    // Full build without version bump
    grunt.registerTask("build", ["clean:build","umd:all","concat", "uglify"]);

    // FOR TRAVIS
    // ==========
    grunt.registerTask("travis", ["jshint", "csslint"]);
    grunt.registerTask("wrapumd", ["umd:all"]);

};
