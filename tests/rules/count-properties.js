(function () {

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Count properties Rule Errors",

        "float count should be equal to 1": function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual(1, result.stats['count-properties'].float.count);
        },

        "left value count should be equal to 1": function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual(1, result.stats['count-properties'].float.values.left.count);
        },

        "right value result object should be equal to null": function () {
            var result = CSSLint.verify(".foo { float: left; }", { "count-properties": 1});
            Assert.areEqual(null, result.stats['count-properties'].float.values.right);
        },

        "right value result should be equal to 2": function () {
            var result = CSSLint.verify(".foo { float: right; } .bar { float: right; font-size: 12px; } .foobar { float: left }", { "count-properties": 1});
            Assert.areEqual(2, result.stats['count-properties'].float.values.right.count);
        }
    }));

})();
