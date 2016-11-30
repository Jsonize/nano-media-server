module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		jshint : {
			options : {
				es5 : false,
				es3 : true
			},
			source : [ "./*.js", "./server.js", "./src/*.js" ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [ 'jshint' ]);

};