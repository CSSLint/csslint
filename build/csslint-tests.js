(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "CSSLint object tests",
        
        "Adjoining classes should not cause an error": function(){
            var result = CSSLint.verify(".foo.bar{}", { });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Adjoining Selector Rule Errors",
        
        "Adjoining classes should result in a warning": function(){
            var result = CSSLint.verify(".foo.bar { }", { "adjoining-classes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Don't use adjoining classes.", result.messages[0].message);
        },

        "Descendant selector with classes should not result in a warning": function(){
            var result = CSSLint.verify(".foo .bar { }", { "adjoining-classes": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Box Model Rule Errors",

        "Using width and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with padding.", result.messages[0].message);
        },

        "Using width when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with padding-left.", result.messages[0].message);
        },

        "Using width when padding-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with padding-right.", result.messages[0].message);
        },

        "Using width when padding-right is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with border.", result.messages[0].message);
        },
        
        "Using width and border-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with border-left.", result.messages[0].message);
        },

        "Using width when border-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with border-right.", result.messages[0].message);
        },

        "Using width when border-right is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with padding.", result.messages[0].message);
        },

        "Using height when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-top should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with padding-top.", result.messages[0].message);
        },

        "Using height when padding-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with padding-bottom.", result.messages[0].message);
        },

        "Using height when padding-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with border.", result.messages[0].message);
        },

        "Using height and border: none should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: none; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border: 0 should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-top should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with border-top.", result.messages[0].message);
        },

        "Using height when border-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with border-bottom.", result.messages[0].message);
        },

        "Using height when border-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 0px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height when border-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
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
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Empty Rule Errors",

        "Empty rule should result in a warning": function(){
            var result = CSSLint.verify("li { }", { "empty-rules": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule is empty.", result.messages[0].message);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Parsing Errors",

        "Parsing error should result in one parsing error message": function(){
            var result = CSSLint.verify("li { float left;}", { errors: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Floats Rule Errors",

        "10 floats should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many floats (10), you're probably using them for layout. Consider using a grid system instead.", result.messages[0].message);
        },

        "9 floats should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "11 floats should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many floats (11), you're probably using them for layout. Consider using a grid system instead.", result.messages[0].message);
        },

        "float: none should not count and therefore should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "font-faces Rule Errors",

        "5 font-faces should result in a warning": function(){
            var result = CSSLint.verify("@font-face{ } @font-face{ } @font-face{ } @font-face{ } @font-face{ }", { "font-faces": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "4 font-faces should not result in a warning": function(){
            var result = CSSLint.verify("@font-face{} @font-face{} @font-face{} @font-face{}", { "font-faces": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "6 font-faces should result in a warning": function(){
            var result = CSSLint.verify("@font-face{} @font-face{} @font-face{} @font-face{} @font-face{} @font-face{}", { "font-faces": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many @font-face declarations (6).", result.messages[0].message);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "font-size Rule Errors",

        "10 font-sizes should result in a warning": function(){
            var result = CSSLint.verify(".foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", {"font-sizes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many font-size declarations (10), abstraction needed.", result.messages[0].message);
        },

        "9 font-sizes should not result in a warning": function(){
            var result = CSSLint.verify(" .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", {"font-sizes": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "11 font-sizes should result in a warning": function(){
            var result = CSSLint.verify(".foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", {"font-sizes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many font-size declarations (11), abstraction needed.", result.messages[0].message);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
/*
background: -moz-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); 
background: -webkit-gradient(linear, left top, left bottom, color-stop(,#1e5799), color-stop(,#2989d8), color-stop(,#207cca), color-stop(10,#7db9e8)); 
background: -webkit-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 );
background: -o-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 );
background: -ms-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 ); 

*/

        name: "Gradients Rule Errors",

        "Only using Mozilla gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -moz-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
        },

        "Only using Opera gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -o-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
        },

        "Only using IE gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -ms-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
        },

        "Only using WebKit gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -webkit-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
        }

        //parser barfs
        /*"Only using old WebKit gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -webkit-gradient(linear, left top, left bottom, color-stop(,#1e5799), color-stop(,#2989d8), color-stop(,#207cca), color-stop(10,#7db9e8)); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
        } */
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "IDs Rule Errors",

        "Using an ID should result in one warning": function(){
            var result = CSSLint.verify("#foo { float: left;}", { ids: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Don't use IDs in selectors.", result.messages[0].message);
        },

        "Using multiple IDs should result in one warning": function(){
            var result = CSSLint.verify("#foo #bar { float: left;}", { ids: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("2 IDs in the selector, really?", result.messages[0].message);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Import Rule Errors",
        
        "Using @import should result in a warning": function(){
            var result = CSSLint.verify("@import url('foo.css');", { "import": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("@import prevents parallel downloads, use <link> instead.", result.messages[0].message);
        }
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "!important; Errors",

        "!important declarations should result in a warning": function(){
            var result = CSSLint.verify("h1 { color:#fff !important; }", { "important": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Use of !important", result.messages[0].message);
        },

        "Using !important at least 10 times should result in an error": function(){
            var css = "h1 { color:#fff !important; } h2 { color:#fff !important; } h3 { color:#fff !important; } h4 { color:#fff !important; } h5 { color:#fff !important; } h6 { color:#fff !important; } p { color:#fff !important; } ul { color:#fff !important; } ol { color:#fff !important; } li { color:#fff !important; }";
            var result = CSSLint.verify(css, { "important": 1 });
            Assert.areEqual(11, result.messages.length);
            Assert.areEqual("error", result.messages[10].type);
            Assert.areEqual("Too many !important declarations (10), be careful with rule specificity", result.messages[10].message);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Overqualified Elements Errors",

        "Using an ID with an element should result in one warning": function(){
            var result = CSSLint.verify("li#foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Element (li#foo) is overqualified, just use #foo without element name.", result.messages[0].message);
        },

        "Using a class without an element should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using a class with an element should result in one warning": function(){
            var result = CSSLint.verify("li.foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Element (li.foo) is overqualified, just use .foo without element name.", result.messages[0].message);
        },
        
        "Using a class with two different elements should not result in a warning": function(){
            var result = CSSLint.verify("li.foo { float: left;} p.foo { float: right; }", { "overqualified-elements": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a class with an element and without should not result in a warning": function(){
            var result = CSSLint.verify("li.foo { float: left;} .foo { float: right; }", { "overqualified-elements": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Qualified Headings Errors",

        "Using a heading as a descendant should result in one warning": function(){
            var result = CSSLint.verify("li h3{ float: left;}", { "qualified-headings": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h3) should not be qualified.", result.messages[0].message);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Regex Selectors Errors",

        "Using |= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class|=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with |= are slow!", result.messages[0].message);
        },

        "Using *= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class*=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with *= are slow!", result.messages[0].message);
        },

        "Using $= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class$=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with $= are slow!", result.messages[0].message);
        },

        "Using ~= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class~=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with ~= are slow!", result.messages[0].message);
        },

        "Using ^= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class^=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with ^= are slow!", result.messages[0].message);
        },

        "Using = in an attribute selector should not result in a warning": function(){
            var result = CSSLint.verify("li[class=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Unique Headings Errors",

        "Defining two rules for h1 should result in one warning": function(){
            var result = CSSLint.verify("h1 { color: red;} h1 {color: blue;}", { "unique-headings": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h1) has already been defined.", result.messages[0].message);
        },

         "Defining one rule for h1 should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;}", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Defining multiple rules that contain h1 should not result in a warning": function(){
            var result = CSSLint.verify("h2 a, h2 a:active, h2 a:hover, h2 a:visited, h2 a:link { color: red;}", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);        
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Vendor Prefix Errors",

        "Using -moz-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { -moz-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-moz-border-radius'.", result.messages[0].message);
        },

        "Using -webkit-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { -webkit-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-webkit-border-radius'.", result.messages[0].message);
        },

        "Using -moz-border-radius after  border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { border-radius: 5px; -moz-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Standard property 'border-radius' should come after vendor-prefixed property '-moz-border-radius'.", result.messages[0].message);
        },

        "Using -webkit-border-bottom-left-radius with border-bottom-left-radius should not result in a warning.": function(){
            var result = CSSLint.verify("h1 { -webkit-border-bottom-left-radius: 4px; border-bottom-left-radius: 4px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using -moz-border-radius-bottomleft should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-border-radius-bottomleft: 5px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-bottom-left-radius' to go along with '-moz-border-radius-bottomleft'.", result.messages[0].message);
        },
        
        "Using -moz-box-shadow should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-box-shadow: 5px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'box-shadow' to go along with '-moz-box-shadow'.", result.messages[0].message);
        },
        
        "Using @font-face should not result in an error (#90)": function(){
            var result = CSSLint.verify("@font-face { src:url('../fonts/UniversBold.otf');font-family:Univers;advancedAntiAliasing: true;}", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    //Commented out pending further review
    /*var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "width: 100%; Errors",

        "Using width: 100% should result in one warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; }", { "width-100": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Elements with a width of 100% may not appear as you expect inside of other elements.", result.messages[0].message);
        },

        "Using width: 100px should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100px; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and -moz-box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; -moz-box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and -webkit-box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; -webkit-box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and -ms-box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; -ms-box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));*/

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Zero Units Errors",

        "Using 0px should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0px; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0em should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0em; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0% should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0%; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0 should not result in a warning": function(){
            var result = CSSLint.verify("h1 { left: 0; }", { "zero-units": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
