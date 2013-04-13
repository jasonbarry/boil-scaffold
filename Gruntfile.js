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
    // Task configuration.
    watch: {
      js: {
        files: ['./src/js/*.js'], 
        tasks: ['js']
      }, 
      sass: {
        files: ['./src/scss/*.scss'],
        tasks: ['css']
      }
    }, 
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
      files: {
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
    exec: {
      todo: {
        command: "grep -rn TODO ./src | sed '^s/ *(\/\/|\/\*|#) *TODO(:)? */- /g' | sed 's/:/      /g > ./TODO.md"
      }, 
      git: {
        commit: {
          command: 'git add -A && git commit'
        },
        push: {
          command: 'git push origin master'
        }
      }
    }, 
    bumpup: 'package.json', 
    clean: {
      tmp: ['./tmp/']
    }, 
    tagrelease: {
      file: 'package.json', 
      message: 'Version %version%', 
      prefix: ''
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');            // done
  grunt.loadNpmTasks('grunt-contrib-jshint');           // done
  grunt.loadNpmTasks('grunt-contrib-concat');           // done
  grunt.loadNpmTasks('grunt-contrib-uglify');           // done
  grunt.loadNpmTasks('grunt-contrib-sass');             // done
  grunt.loadNpmTasks('grunt-csso');                     // done
  // grunt.loadNpmTasks('grunt-mocha-phantomjs');
  // grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-exec');                     // done
  grunt.loadNpmTasks('grunt-bumpup');                   // done
  grunt.loadNpmTasks('grunt-tagrelease');               // done
  // grunt.loadNpmTasks('grunt-dox');
  // grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-clean');            // done
  grunt.loadNpmTasks('grunt-notify');                   // done (just works)


  // Default task.
  grunt.registerTask('default', [
    'jshint',     // validate js
    'concat',     // test js
    // 'mocha',      // combine js
    'uglify',     // minify js
    'sass', 
    'csso', 
    'shared'
  ]);

  // js only
  grunt.registerTask('js', [
    'jshint',     // validate js
    'mocha',      // test js
    'concat',     // combine js
    'uglify',     // minify js
    'shared'
  ]);

  // css only
  grunt.registerTask('css', [
    'sass', 
    'csso', 
    'shared'
  ]);

  grunt.registerTask('shared', [
    'dox', 
    'exec:todo', 
    'bumpup:build', 
    'clean'
  ]);

  // release 
  grunt.registerTask('release', function (type) {
    type = type ? type : 'patch';       // set the release type
    grunt.task.run('jshint');           // validate js
    grunt.task.run('mocha');            // test js
    grunt.task.run('concat');           // combine js
    grunt.task.run('uglify');           // minify js
    grunt.task.run('sass');             // preprocess css
    grunt.task.run('csso');             // minify and remove redundancy of css
    grunt.task.run('dox');              // generate documentation
    grunt.task.run('exec:todo');        // generate todo file
    grunt.task.run('bumpup:' + type);   // bump up package version number
    grunt.task.run('clean');            // delete all files in tmp folder
    grunt.task.run('exec:git:commit');  // add and commit changes
    grunt.task.run('tagrelease');       // tag commit with version number
    grunt.task.run('exec:git:push');    // push to remote origin on master
  });

};
