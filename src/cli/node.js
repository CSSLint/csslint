/*global ActiveXObject, cli, CSSLint, Enumerator, print, WScript */
/*jslint sloppy: true */

/*
 * CSSLint
 * Command Line Interface
 * Node.js
 */

importPackage(java.io);

cli({
	args: process.argv.slice(2),
	command: 'csslint-node.js',
	environment: 'Node.js',
	print: console.log,
	quit: process.exit,
	
	getDirectoryContents: function (path) {
		var contents;
		contents = [];
		require('fs').readdirSync(path).each(function(file) {
			contents.push(path . '/' . file);
		});
		return contents;
	},
	
	getFileContent: function (path) {
		return require('fs').readFileSync(path, 'utf-8')
	},
	
	isDirectory: function (path) {
		return require('fs').statSync(path).isDirectory();
	},
	
	isFile: function (path) {
		return require('fs').statSync(path).isFile();
	}
});