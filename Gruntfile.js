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
    concat: {
      js: {
        src: ['./src/js/*.js'],
        dest: './tmp/master.concat.js'
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
        devel: true, 
        globals: {}
      },
      files: {
        src: ['./tmp/master.concat.js']
      }
    },
    mocha: {
      all: ['./test/*.html'], 
      options: {
        reporter: 'Nyan', 
        run: true
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
          './dist/scripts/master.min.js': ['./tmp/master.concat.js']
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['./src/js/*.js'], 
        options: {
          destination: 'docs'
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
          './dist/styles/master.min.css': './tmp/sass.css'
        }
      }
    },
    exec: {
      todo: {
        command: "grep -rn TODO ./src | sed 's/\\s*\\/\\/ TODO: /- /g' | sed 's/:/      /g' > ./TODO.txt"
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
      tmp: ['./tmp/*']
    }, 
    tagrelease: {
      file: 'package.json', 
      message: 'Version %version%', 
      prefix: ''
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');            // done
  grunt.loadNpmTasks('grunt-contrib-jshint');           // done
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-concat');           // done
  grunt.loadNpmTasks('grunt-contrib-uglify');           // done
  grunt.loadNpmTasks('grunt-contrib-sass');             // done
  grunt.loadNpmTasks('grunt-csso');                     // done
  // grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-exec');                     // done
  grunt.loadNpmTasks('grunt-bumpup');                   // done
  grunt.loadNpmTasks('grunt-tagrelease');               // done
  grunt.loadNpmTasks('grunt-jsdoc');                    // done
  // grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-clean');            // done
  grunt.loadNpmTasks('grunt-notify');                   // done (just works)


  // Default task.
  grunt.registerTask('default', [
    'concat',     // combine js
    'jshint',     // validate js
    'mocha',      // test js
    'uglify',     // minify js
    // 'jsdoc', 
    'sass', 
    'csso', 
    'shared'
  ]);

  // js only
  grunt.registerTask('js', [
    'concat',     // combine js
    'jshint',     // validate js
    'mocha',      // test js
    'uglify',     // minify js
    // 'jsdoc', 
    'shared'
  ]);

  // css only
  grunt.registerTask('css', [
    'sass', 
    'csso', 
    'shared'
  ]);

  grunt.registerTask('shared', [
    'exec:todo', 
    'bumpup:build', 
    'clean'
  ]);

  // release 
  grunt.registerTask('release', function (type) {
    type = type ? type : 'patch';       // set the release type
    grunt.task.run('concat');           // combine js
    grunt.task.run('jshint');           // validate js
    grunt.task.run('mocha');            // test js
    grunt.task.run('uglify');           // minify js
    grunt.task.run('sass');             // preprocess css
    grunt.task.run('csso');             // minify and remove redundancy of css
    grunt.task.run('jsdoc');            // generate documentation
    grunt.task.run('exec:todo');        // generate todo file
    grunt.task.run('bumpup:' + type);   // bump up package version number
    grunt.task.run('clean');            // delete all files in tmp folder
    grunt.task.run('exec:git:commit');  // add and commit changes
    grunt.task.run('tagrelease');       // tag commit with version number
    grunt.task.run('exec:git:push');    // push to remote origin on master
  });

};
