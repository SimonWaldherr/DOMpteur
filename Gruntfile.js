module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "./DOMpteur.js", "./DOMpteur.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        }
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * * *\n' +
                ' *    DOM pteur    *\n' +
                ' *  Version 0.2.4  *\n' +
                ' *  License:  MIT  *\n' +
                ' * Simon  Waldherr *\n' +
                ' * * * * * * * * * */\n\n',
        footer: '\n\n\n\n /* foo */'
      },
      dist: {
        files: {
          './DOMpteur.min.js': ['./DOMpteur.js']
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'compare_size']);
};
