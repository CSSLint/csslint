/*
 * Rule: Performs a series of checks against properties which reference a resource */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "resource",
    name: "Resource",
    desc: "Performs a series of checks against properties which reference resources.",
    browsers: "All",

    //initialization
    init: function(parser, reporter, cli){
    
        var rule = this,
        
            properties = {

                "background": 1,            
                "background-image": 1,
				"border-image": 1,  
				"border-image-source": 1,  				              
                "content": 1,
                
                //@font-face
                "src": 1
  
            },     
            
			uriReg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
            
            tests = {
            
            	external : {
            		msg : 'Consider using a localised resource instead for \'#{path}\'',          		
		            		
				    /**
				     * Check if the path / uri matches an external uri
				     * @param {string} path A uri or path.
				     * @returns {boolean}
				     */            		
            		cmd : function (path) {  
            			return uriReg.test(path);
            		}
            	},
            	
			    /**
			     * This test only runs if we are using the cli
			     */
            	filesystem : {
            		msg: '\'#{path}\' does not exist in the file system',
            		cli: true,  
            		
				    /**
				     * Check if the path exists on the file system
				     * @param {string} path A uri or path.
				     * @returns {boolean}
				     */                    		          		
            		cmd: function (path) {

            			var result = false,
            				uri = path.split('?')[0];

            			if (!tests.external.cmd(path) && path.substr(0, 5) !== 'data:') {
            				result = !cli.isFile(path);
            			}
            		
            			return result;
            		}
            	}
            	
            },            
            
			matches,	

		    /**
		     * Processes an array of matched properties
		     * @param {array} matches An array of matched properties that could contain paths.
		     */
            testPath = function (matches) {

	            if (!matches.length) {
	                return;
	            }                        
            
	        	var len = matches.length,
	        		i = 0,
	        		match,
	        		test,
	        		path,
	        		error = false,
	        		temp = null,
	        		cmd = null,
	        		msg = '';

	            for (i; i < len; i++) {
	            	
	            	match = matches[i];
	            	path = match.uri || null;
	            	
	            	if (path) {
	            	
		            	for (test in tests) {
		            	
							if (tests.hasOwnProperty(test)) {
							
								temp = tests[test];
								
								if (temp.cli && !cli) {
									break;
								}
							
								cmd = temp.cmd || null;
							
								if(typeof cmd === 'function') {
								
									error = cmd(path);
									
									if (error) {
										msg = temp.msg.replace('#{path}', path);
										reporter.warn(msg, match.line, match.col, rule);
									}									
									
								}
	
							}
						}
						
	            	}
	            	
	            }
	            	
            },
            
            skipped = 0;

        parser.addListener("import", function(event){
        	testPath([{
        		name: '@import',
        		line: event.line,
        		col: event.col,
        		uri: event.uri
        	}]);
        });

        parser.addListener("startfontface", function(event){
			matches = [];
        });             
        
        parser.addListener("startrule", function(event){
			matches = [];
        });

        parser.addListener("startpage", function(event){
			matches = [];
        });
        
        parser.addListener("startpagemargin", function(event){
			matches = [];
        }); 
        
        parser.addListener("startkeyframes", function(event){
			matches = [];
        });      
        
        parser.addListener("property", function(event){
        
            var name = event.property.text.toLowerCase(),
            	parts,
            	part,
            	temp;

            if (properties[name]){
            	
            	parts = event.value.parts;
            	
            	// need to evanluate all parts as there could be multiple uris for @font-face
            	for(part in parts) {
            	
            		if (parts.hasOwnProperty(part) && parts[part]['type'] === 'uri') {
            		
            			temp = parts[part];
		            	matches.push({
		            		name: name,
							value: temp.text, 
							line: temp.line, 
							col: temp.col,
							uri: temp.uri          	
		            	});
		            	
            		}	
            	}
                    
            }
            
        });
        
        parser.addListener("endrule", function(event){
            testPath(matches);
        });

        parser.addListener("endfontface", function(event){
            testPath(matches);
        });

        parser.addListener("endpage", function(event){
            testPath(matches);
        });

        parser.addListener("endpagemargin", function(event){
            testPath(matches);
        });

        parser.addListener("endkeyframe", function(event){
            testPath(matches);
        });

    }

});