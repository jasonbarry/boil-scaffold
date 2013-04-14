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
        bitwise: true, 
        boss: true,
        browser: true, 
        camelcase: true, 
        curly: true,
        devel: true, 
        eqeqeq: true,
        eqnull: true,
        immed: true,
        indent: 4, 
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true
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
      js: ['./tmp/*.js'], 
      css: ['./tmp/*.css']
    }, 
    tagrelease: {
      file: 'package.json', 
      message: 'Version %version%', 
      prefix: ''
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');         
  grunt.loadNpmTasks('grunt-contrib-concat');        
  grunt.loadNpmTasks('grunt-contrib-jshint');        
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');        
  grunt.loadNpmTasks('grunt-contrib-sass');          
  grunt.loadNpmTasks('grunt-csso');                  
  grunt.loadNpmTasks('grunt-contrib-clean');         
  // grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-exec');                  
  grunt.loadNpmTasks('grunt-jsdoc');                 
  grunt.loadNpmTasks('grunt-bumpup');                
  grunt.loadNpmTasks('grunt-tagrelease');            
  // grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-notify');                


  // Default task 
  grunt.registerTask('default', [
    'js', 
    'css' 
  ]);

  // js only
  grunt.registerTask('js', [
    'concat',     // combine 
    'jshint',     // validate 
    'mocha',      // test 
    'uglify',     // minify 
    'clean:js'    // clean files in tmp
  ]);

  // css only
  grunt.registerTask('css', [
    'sass',       // preprocessor
    'csso',       // minify and remove redundancy
    'clean:css'   // clean files in tmp
  ]);

  grunt.registerTask('todo', [
    'exec:todo'   // generate todo file
  ]);

  // release 
  grunt.registerTask('release', function (type) {
    type = type ? type : 'patch';       // set the release type
    grunt.task.run('js');               
    grunt.task.run('css');             
    grunt.task.run('todo');             
    grunt.task.run('jsdoc');            // generate documentation
    grunt.task.run('bumpup:' + type);   // bump up package version number
    grunt.task.run('exec:git:commit');  // add and commit changes
    grunt.task.run('tagrelease');       // tag commit with version number
    grunt.task.run('exec:git:push');    // push to remote origin on master
  });

};
