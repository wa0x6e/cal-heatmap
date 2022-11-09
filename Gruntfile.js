module.exports = function (grunt) {
  'use strict'

  const headerComment =
    '/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today() %>)\n' +
    ' *  ---------------------------------------------\n' +
    ' *  <%= pkg.description %>\n' +
    ' *  <%= pkg.homepage %>\n' +
    ' *  Licensed under the <%= pkg.license %> license\n' +
    ' *  Copyright 2014 <%= pkg.author.name %>\n' +
    ' */\n'

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    csslint: {
      base: {
        src: '<%= pkg.name %>.css',
        options: {
          'known-properties': false,
          'order-alphabetical': false,
          'box-sizing': false
        }
      }
    },
    uglify: {
      options: {
        banner: headerComment
      },
      base: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
        }
      }
    },
    qunit: {
      options: {
        '--web-security': 'no',
        puppeteer: {
          ignoreDefaultArgs: true,
          args: [
            '--headless',
            '--disable-web-security',
            '--allow-file-access-from-files'
          ]
        },
        coverage: {
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          htmlReport: 'report/coverage',
          coberturaReport: 'report/'
        }
      },
      all: ['test/*.html']
    },
    concat: {
      options: {
        banner: headerComment + '\n'
      },
      js: {
        src: ['src/<%= pkg.name %>.js'],
        dest: '<%= pkg.name %>.js'
      },
      test: {
        src: ['test/src/function.js', 'test/src/**/*.js'],
        dest: 'test/test.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    watch: {
      scripts: {
        files: 'test/src/**/*.js',
        tasks: ['concat:test'],
        options: {
          interrupt: true
        }
      }
    },
    exec: {
      format:
        'npx prettier -w "src/**/*.{html,js,json,md,mjs,yml}" && npx prettier -w "test/**/*.{html,js,json,md,mjs,yml}"'
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-csslint')
  grunt.loadNpmTasks('grunt-contrib-qunit')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // TO RUN BEFORE COMMIT
  // ====================
  grunt.registerTask('quick-build', ['csslint'])

  // Full build without version bump
  grunt.registerTask('build', [
    'exec:format',
    'concat',
    'qunit',
    'csslint',
    'uglify'
  ])

  // FOR TRAVIS
  // ==========
  grunt.registerTask('travis', ['csslint'])
}
