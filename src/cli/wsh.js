/*global ActiveXObject, cli, CSSLint, Enumerator, print, WScript */
/*jslint sloppy: true */

/*
 * CSSLint
 * Command Line Interface
 * Windows Script Host
 */

cli.init({
	command: 'cscript.exe //E:JScript csslint-wsh.js',
	environment: 'Windows Script Host (WSH)',
	print: WScript.StdOut.Write,
	quit: WScript.Quit,
	
	args: (function () {
		var args, index;
		args = [];
		for (index = 0; index < WScript.Arguments.length; index += 1) {
			args.push(WScript.Arguments(index));
		}
		return args;
	}()),
	
	getDirectoryContents: function (path) {
		var content, contents, folder;
		folder = new ActiveXObject('Scripting.FileSystemObject').GetFolder(path);
		for (content = new Enumerator(folder.SubFolders); !content.atEnd(); content.moveNext()) {
			contents.push(content.item());
		}
		for (content = new Enumerator(folder.Files); !content.atEnd(); content.moveNext()) {
			contents.push(content.item());
		}
		return contents;
	},
	
	getFileContent: function (path) {
		var content, handler;
		handler = new ActiveXObject('Scripting.FileSystemObject').OpenTextFile(path, 1);
		content = handler.ReadAll();
		handler.Close();
		return content;
	},
	
	isDirectory: function (path) {
		return new ActiveXObject('Scripting.FileSystemObject').FolderExists(path);
	},
	
	isFile: function (path) {
		return new ActiveXObject('Scripting.FileSystemObject').FileExists(path);
	}
});