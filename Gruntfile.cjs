module.exports = function (grunt) {
  const headerComment =
    '/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today() %>)\n' +
    ' *  ---------------------------------------------\n' +
    ' *  <%= pkg.description %>\n' +
    ' *  <%= pkg.homepage %>\n' +
    ' *  Licensed under the <%= pkg.license %> license\n' +
    ' *  Copyright 2014 <%= pkg.author.name %>\n' +
    ' */\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    csslint: {
      base: {
        src: 'src/<%= pkg.name %>.css',
        options: {
          'known-properties': false,
          'order-alphabetical': false,
          'box-sizing': false,
        },
      },
    },
    concat: {
      options: {
        banner: headerComment + '\n',
      },
      css: {
        src: ['src/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.css',
      },
    },

    watch: {
      test: {
        files: 'test/**/*.js',
        tasks: ['exec:test'],
        options: {
          interrupt: true,
        },
      },
    },
    exec: {
      format:
        'npx prettier -w "*.js" && npx prettier -w "src/**/*.{html,js,json,md,mjs,yml}" && npx prettier -w "test/**/*.{html,js,json,md,mjs,yml}"',
      test: 'npm run test',
    },
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // TO RUN BEFORE COMMIT
  // ====================
  grunt.registerTask('quick-build', ['csslint']);

  // Full build without version bump
  grunt.registerTask('build', ['exec:format', 'concat', 'csslint']);

  // FOR TRAVIS
  // ==========
  grunt.registerTask('travis', ['csslint']);

  grunt.registerTask('test', ['exec:test']);
};
