/*global ActiveXObject, cli, CSSLint, Enumerator, print, WScript */
/*jslint sloppy: true */

/*
 * CSSLint
 * Command Line Interface
 * Rhino
 */

importPackage(java.io);

cli({
	args: Array.prototype.slice.call(arguments),
	command: 'csslint-rhino.js',
	environment: 'Rhino',
	print: console.log,
	quit: quit,
	
	getDirectoryContents: function (path) {
		return new File(path).listFiles();
	},
	
	getFileContent: function (path) {
		return readFile(path, 'utf-8')
	},
	
	isDirectory: function (path) {
		return new File(path).isDirectory();
	},
	
	isFile: function (path) {
		return new File(path).isFile();
	}
});