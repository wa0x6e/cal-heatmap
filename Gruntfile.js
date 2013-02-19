module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        qunit: {
            files: ["test/index.html"]
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: ["cal-heatmap.js"]
        },
        csslint: {
            src: "cal-heatmap.css"
        },
        uglify: {
            files: {
                "cal-heatmap.min.js" : ["cal-heatmap.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-css");

    // Task to run tests
    grunt.registerTask("build", ["qunit", "jshint", "uglify", "csslint"]);
};