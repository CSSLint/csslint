(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Display Property Grouping Rule Errors",

/*
 * - float should not be used with inline-block
 * - height, width, margin-top, margin-bottom, float should not be used with inline
 * - vertical-align should not be used with block
 * - margin, float should not be used with table-*
*/
        "Float with inline-block should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: inline-block; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("float can't be used with display: inline-block.", result.messages[0].message);
        },

        "Float with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).", result.messages[0].message);
        },

        "Float:none with inline-block should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: inline-block; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Float:none with inline should result not in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Height with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("height can't be used with display: inline.", result.messages[0].message);
        },

        "Width with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("width can't be used with display: inline.", result.messages[0].message);
        },

        "Margin with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin can't be used with display: inline.", result.messages[0].message);
        },

        "Margin-left with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-left: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Margin-right with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-right: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Margin-top with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-top: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-top can't be used with display: inline.", result.messages[0].message);
        },

        "Margin-bottom with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-bottom: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-bottom can't be used with display: inline.", result.messages[0].message);
        },

        "Padding with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-left with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-left: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-right with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-right: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-top with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-top: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-bottom with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-bottom: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        }, 

        "Vertical-align with block should result in a warning": function(){
            var result = CSSLint.verify(".foo { vertical-align: bottom; display: block; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("vertical-align can't be used with display: block.", result.messages[0].message);
        },

        "Margin with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-left with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-left: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-left can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-right with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-right: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-right can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-top with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-top: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-top can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-bottom with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-bottom: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-bottom can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-left with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-left: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-left can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-right with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-right: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-right can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-top with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-top: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-top can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-bottom with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-bottom: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-bottom can't be used with display: table-row.", result.messages[0].message);
        },

        "Float with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("float can't be used with display: table-row.", result.messages[0].message);
        },

        "Float with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("float can't be used with display: table-cell.", result.messages[0].message);
        },

        "Float:none with table-row should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Float:none with table-cell should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
