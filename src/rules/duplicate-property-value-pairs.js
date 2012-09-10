/*
 * Rule: Be aware of duplicate property-value pairs.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "duplicate-property-value-pairs",
    name: "Duplicate property-value pairs",
    desc: "Be aware of duplicate property-value pairs. Many duplicates may indicate the need for abstratcion.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        var count = {};

        //count how many times "float" is used
        parser.addListener("property", function(event){
            var prop = event.property.text.toLowerCase(),
                val  = event.value.text.toLowerCase(),
                key  = prop + '|' + val;

            if (!count[key]) {
                count[key] = 0;
            }

            count[key] += 1;
        });

        //report the results
        parser.addListener("endstylesheet", function(){
            var data = [],
                msg  = [];

            for (var prop in count) {
                if (count.hasOwnProperty(prop)) {
                    data.push([prop, count[prop]]);
                }
            }

            data.sort(function (a, b) {
                return b[1] - a[1];
            });

            data = data.map(function (item) {
                return item[1] + '|' + item[0];
            }).join('\n');

            reporter.rollupWarn('Duplicate property-value-pairs:\n\n' + data);
        });
    }

});
