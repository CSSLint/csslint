(function () {

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert,

        uri = 'resource.ext',

        uri_external = "http://www.external.com/resource/" + uri,

        uri_local = "../resource/" + uri,
        
        uri_data = "data:font/opentype;base64,[base-encoded font here]",

        default_template = ".#{key} { #{key}: url('#{uri}');}",

        properties = [

	        {
	            key: '@import',
	            template: "#{key} url('#{uri}');"
	        }, {
	            key: '@font-face',
	            template: "#{key} {font-family: 'MyFontFamily'; src: url('#{uri}') format('embedded-opentype'), url('#{uri}') format('woff'), url('#{uri}')  format('truetype'), url('#{uri}') format('svg');}"
	        }, {
	            key: 'background'
	        }, {
	            key: 'background-image'
	        }, {
	            key: 'border-image'
	        }, {
	            key: 'border-image-source'
	        }, {
	            key: 'content'
	        }

        ],

        util = {

	        test : function (template, value, warn) {
	        
	        	return function () {
	        	
					var temp = template.replace(/#{uri}/g, value),
						result = CSSLint.verify(temp, {"resource": 1}),
		                mlength = result.messages.length,
		                matches = temp.match(/url\(/gi),
		                i = 0;

					if (warn) {
	
						Assert.areEqual(matches.length, mlength);
	
			            for (i; i < mlength; i = i + 1) {
			                Assert.areEqual("warning", result.messages[i].type);
			                Assert.areEqual("Consider using a localised resource instead for '" + value + "'", result.messages[i].message);
			            }
	
					} else {
	
						Assert.areEqual(i, mlength);
	
					}	        	
	        	
	        	}
	        },

	        /**
	         * Build a test object
	         * @param {string} name The name for the test case.
	         * @param {array} properties An array of proporties / tests.	     
	         * @returns {object}
	         */
	        generateTest : function (name, properties) {

	            var tests = {},
	                property,
	                title = '',
	                template = default_template,
	                temp,
	                key,
	                i = 0,
	                plen = properties.length;

	            tests.name = name;

	            for (i; i < plen; i = i + 1) {

	                property = properties[i];
	                temp = property.template || template;
	                key = property.key;
	                title = ' resource in ' + key + ' should ';

	                temp = temp.replace(/#{key}/g, key);        

	                tests['Referencing external' + title + 'result in a warning'] = util.test(temp, uri_external, true);
	                tests['Referencing local' + title + ' not result in a warning'] = util.test(temp, uri_local, false);
	                tests['Referencing data uri' + title + ' not result in a warning'] = util.test(temp, uri_data, false);	                

	            }

	            return tests;

	        }

        };

    YUITest.TestRunner.add(new YUITest.TestCase(util.generateTest('Resource Errors', properties)));

}());