/*
 * CSSLint
 * Command Line(s) Interface
 */

if (typeof print === 'undefined') {
	print = null;
}
var cli = (function (print) {
	var that;
	
	that = {
		exitCode: 0,
		extensions: {},
		mode: '+',
		option: 'files',
		rules: {},
		
		handleExtension: function (extension) {
			if (extension.indexOf('+') === 0) {
				extension = extension.substr(1);
				that.mode = '+';
			} else if (extension.indexOf('-') === 0) {
				extension = extension.substr(1);
				that.mode = '-';
			}
			extension = extension.toLowerCase();
			if (extension === 'none') {
				that.extensions = [];
			} else if (that.mode === '-') {
				if (extension === 'all') {
					that.extensions = [];
				} else {
					delete that.extensions[extension];
				}
			} else {
				if (extension === 'all') {
					that.extensions.css = true;
				} else {
					that.extensions[extension] = true;
				}
			}
		},
		
		handleFile: function (config, path) {
			var errors, messages, position, warnings;
			
			// Run CSSLint
			messages = CSSLint.verify(config.getFileContent(path), that.rules).messages;
			if (Object.isArray(messages) === false) {
				messages = [];
			}
			if (messages.length === 0) {
				config.print("\n" + 'Successfully verified: ' + path  + "\n");
			} else {
				// Split messages into errors and warning
				errors = [];
				warnings = [];
				messages.each(function (message) {
					if (message.type === 'error') {
						errors.push(message);
					} else if (message.type === 'warning') {
						warnings.push(message);
					}
				});
				config.print("\n" + 'Found ' + String(errors.length) + ' errors and ' + String(warnings.length)  + ' warnings in ' + path + '.' + "\n");
				
				// Create path basename
				position = path.indexOf('/');
				if (position !== false) {
					path = path.substr(position + 1);
				}
				position = path.indexOf('\\');
				if (position !== false) {
					path = path.substr(position + 1);
				}
				
				// Print errors and warning
				[errors, warnings].each(function (messages) {
					position = 0;
					messages.each(function (message) {
						config.print("\n" + path + ' (' + message.type + ' ' + String(position) + '):' + "\n");
						position += 1;
						if (message.rollup === true) {
							config.print(message.message + "\n");
						} else {
							config.print('Line ' + message.line + ', column ' + message.col + "\n" + message.message + "\n" + message.evidence + "\n");
						}
					});
				});
				
				// Set exit code
				if (errors > 0) {
					that.exitCode = 1;
				}
			}
		},
		
		handleOption: function (config, argument) {
			// Handle command line options
			argument = argument.toLowerCase();
			if (argument.indexOf('e') === 0) {
				that.mode = '+';
				that.option = 'extensions';
			} else if (argument.indexOf('f') === 0) {
				that.option = 'files';
			} else if (argument.indexOf('h') === 0) {
				config.printHelp(config);
				that.option = 'help';
			} else if (argument.indexOf('r') === 0) {
				that.mode = '+';
				that.option = 'rules';
			}
		},
		
		handlePath: function (config, path) {
			var parse;
			if (config.isDirectory(path) === true) {
				config.getDirectoryContents(path).each(function (path) {
					that.handlePath(config, path);
				});
			} else if (config.isFile(path) === false) {
				config.print("\n" + 'Error: Could not read ' + path + '.'  + "\n");
				that.exitCode = 1;
			} else {
				parse = false;
				Object.keys(that.extensions).each(function (extension) {
					extension = '.' + extension;
					if (path.substr(path.length - extension.length).toLowerCase() === extension) {
						parse = true;
					}
				});
				if (parse === true) {
					that.handleFile(config, path);
				}
			}
		},
		
		handleRule: function (rule) {
			rule.split(',').each(function (rule) {
				if (rule.indexOf('+') === 0) {
					rule = rule.substr(1);
					that.mode = '+';
				} else if (rule.indexOf('-') === 0) {
					rule = rule.substr(1);
					that.mode = '-';
				}
				rule = rule.toLowerCase();
				if (rule === 'none') {
					that.rules = [];
				} else if (that.mode === '-') {
					if (rule === 'all') {
						that.rules = [];
					} else {
						delete that.rules[rule];
					}
				} else {
					if (rule === 'all') {
						Object.keys(CSSLint.getRules()).each(function (rule) {
							that.rules[rule] = true;
						});
					} else {
						that.rules[rule] = true;
					}
				}
			});
		},
		
		printHelp: function (config) {
			return config.print("\n" + 'CSSLint ' + CSSLint.version + ' for ' + config.environment + "\n\n" + 'Automated linting of Cascading Stylesheets' + "\n\n" + 'Syntax:' + "\n" + '    ' + config.command + ' [options]' + "\n\n" + 'Options:' + "\n" + '  --extensions' + "\n" + '  --files' + "\n" + '  --help' + "\n" + '  --rules'  + "\n");
		}
	};
	
	/*
	 * config                   (object)
	 *  -> args                 (array)
	 *  -> command              (string)
	 *  -> environment          (string)
	 *  -> getDirectoryContents (function)
	 *  -> getFileContent       (function)
	 *  -> isDirectory          (function)
	 *  -> isFile               (function)
	 *  -> print                (function)
	 */
	return function (config) {
		if (typeof print === 'function') {
			config.print = print;
		}
		that.exitCode = 0;
		that.option = 'files';
		that.handleExtension('+all');
		that.handleRule('+all');
		
		// Parse arguments
		if (config.args.length === 0) {
			that.handleOption(config, 'help');
		}
		config.args.each(function (argument) {
			if (argument.indexOf('--') === 0) {
				that.handleOption(config, argument.substr(2));
			} else if (that.option === 'extensions') {
				that.handleExtension(argument);
			} else if (that.option === 'files') {
				that.handlePath(config, argument);
			} else if (that.option === 'rules') {
				that.handleRule(argument);
			}
		});
		return config.quit(that.exitCode);
	};
}(print));