(function () {

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Count properties Rule Errors",

        "float count should be equal to 1": function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual(1, result.stats['count-properties'].properties.float.count);
        },

        "property border-radius count should be equal to 2": function () {
            var result = CSSLint.verify(".foo { -moz-border-radius:3px; border-radius:3px; }", { "count-properties": 1});
            Assert.areEqual(2, result.stats['count-properties'].properties['border-radius'].count);
        },

        "property opacity count should be equal to 4": function () {
            var result = CSSLint.verify(".foo { mso-opacity:1; opacity:1; -ms-opacity:1; prince-opacity:1; }", { "count-properties": 1});
            Assert.areEqual(4, result.stats['count-properties'].properties['opacity'].count);
        },

        "left value count should be equal to 1": function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual(1, result.stats['count-properties'].properties.float.values.left.count);
        },

        "right value result object should be equal to null": function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual(null, result.stats['count-properties'].properties.float.values.right);
        },

        "right value result should be equal to 2": function () {
            var result = CSSLint.verify(".foo { float: right; } .bar { float: right; font-size: 12px; } .foobar { float: left }", { "count-properties": 1});
            Assert.areEqual(2, result.stats['count-properties'].properties.float.values.right.count);
        },

        'string version of properties result should be equal to : "float":{"count":1,"values":{"left":{"count":1}}}}': function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual('{"float":{"count":1,"values":{"left":{"count":1}}}}', result.stats['count-properties'].stringResult);
        }



    }));

})();
