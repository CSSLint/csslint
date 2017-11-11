CSSLint.addRule({
  id: "performant-transitions",
  name: "Allow only performant transisitons",
  desc: "Only allow transitions that trigger compositing for performant, 60fps transformations.",
  url: "",
  browsers: "All",

  init: function(parser, reporter){
    "use strict";
    var rule = this;

    var transitionProperties = ["transition-property", "transition", "-webkit-transition", "-o-transition"];
    var allowedTransitions = [/-webkit-transform/g, /-ms-transform/g, /transform/g, /opacity/g];

    parser.addListener("property", function(event) {
      var propertyName    = event.property.toString().toLowerCase(),
          propertyValue           = event.value.toString(),
          line            = event.line,
          col             = event.col;

      var values = propertyValue.split(",");
      if (transitionProperties.indexOf(propertyName) !== -1) {
        var reportValues = values.filter(function(value) {
          var didMatch = [];
          for (var i = 0; i < allowedTransitions.length; i++) {
            if(value.match(allowedTransitions[i])) {
              didMatch.push(i);
            }
          }
          return didMatch.length === 0;
        });
        if(reportValues.length > 0) {
            reporter.report("Unexpected transition property '"+reportValues.join(",").trim()+"'", line, col, rule);
        }
      }
    });
  }
});
