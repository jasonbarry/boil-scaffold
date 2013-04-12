/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    src: {
      js: './src/js/*.js', 
      scss: './src/scss/zmain.scss', 
    }, 
    tmp: {
      js: './tmp/master.js', 
      css: './tmp/master.css'
    }, 
    dest: {
      js: './dist/scripts/master.min.js', 
      css: './dist/styles/master.min.css'
    }
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      all: {
        src: ['./src/js/*.js']
      }
    },
    concat: {
      js: {
        src: ['./src/js/*.js'],
        dest: './tmp/master.concat.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        options:  {
          // sourceMap: 'path/to/source-map.js'
        }, 
        files: {
          src: './tmp/master.concat.js',
          dest: './dist/scripts/master.min.js'
        }
      }
    },
    sass: {
      dist: {
        files: {
          './tmp/sass.css': 'src/scss/zmain.scss'
        }
      }
    }, 
    csso: {
      dist: {
        files: {
          './tmp/csso.css': './tmp/sass.css'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-notify');



  // Default task.
  grunt.registerTask('default', ['concat', 'js', 'css', 'dox', 'notify']);

  grunt.registerTask('css', ['sass', 'csslint', 'csso']);

  grunt.registerTask('js', ['jshint', 'mocha', 'uglify']);

};
