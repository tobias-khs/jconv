'use strict';

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-closurecompiler');

	grunt.initConfig({

		closurecompiler: {
			minify: {
			  files: {
				'jconv.min.js': 'jconv.js'
			  }
			},
			options: {
			  'compilation_level': 'SIMPLE_OPTIMIZATIONS'
			}
		}
	});

	return grunt.registerTask('minify', ['closurecompiler:minify']);
};

