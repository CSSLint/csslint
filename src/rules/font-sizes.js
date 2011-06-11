/*
 * Rule: You shouldn't use more than 10 floats. If you do, there's probably
 * room for some abstraction.
 */
 
/*
 * Note: not sure what to do about font sizes that are close in size. Just pixels. 
 * Also, check for too close pixel sizes and point out at the end.
 */
CSSLint.addRule({

    //rule information
    id: "font-sizes",
    name: "Font Sizes",
    desc: "Checks the number of font-size declarations versus the number of unique font sizes",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this,    
            count = 0,
            data = {
                values: [],
                valuesPx: [],
                smallIncrementPairs: []
            };
    
        //check for use of "font-size"
        parser.addListener("property", function(event){
            var part = event.value.parts[0];
            if (event.property == "font-size"){
                count++;
                
                //see if this is already in the array
                if (indexOf(data.values, part.text) == -1){
                    data.values.push(part.txt);
                    
                    //eliminate any non-pixel values
                    if (part.units == "px"){
                        data.valuesPx.push(part.value);
                    }                    
                }
            }
        });
        
        //report the results
        parser.addListener("endstylesheet", function(event){
            reporter.stat("font-sizes", count);
            if (count >= 10){
                reporter.rollupWarn("Too many font-size declarations (" + count + "), abstraction needed.", rule);
            }
        }); 
    }

});