module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            files: ["test/index.html", "test/index-amd.html"]
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: ["cal-heatmap.js", "test/test.js"]
        },
        csslint: {
            base: {
                src: "cal-heatmap.css",
                rules: {
                    "known-properties": false
                }
            }
        },
        uglify: {
            base: {
                files: {
                    "cal-heatmap.min.js" : ["cal-heatmap.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-css");

    // Task for build
    grunt.registerTask("build", ["qunit", "jshint", "uglify", "csslint"]);

    // Task for travis
    grunt.registerTask("travis", ["qunit", "jshint", "csslint"]);
};