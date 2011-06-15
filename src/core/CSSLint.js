

/**
 * Main CSSLint object.
 * @class CSSLint
 * @static
 * @extends parserlib.util.EventTarget
 */
var CSSLint = (function(){

    var rules   = [],
        api     = new parserlib.util.EventTarget();
    
    function merge( a, b ){
        
        for (var p in b){
            if (b.hasOwnProperty(p)){
                a[p] = b[p];
            }
        }
        return a;
    }
    
    //-------------------------------------------------------------------------
    // Rule Management
    //-------------------------------------------------------------------------
        
    /**
     * Adds a new rule to the engine.
     * @param {Object} rule The rule to add.
     * @method addRule
     */
    api.addRule = function(rule){
        rules.push(rule);
        rules[rule.id] = rule;
    };
    
    /**
     * Clears all rule from the engine.
     * @method clearRules
     */
    api.clearRules = function(){
        rules = [];
    };

    //-------------------------------------------------------------------------
    // Verification
    //-------------------------------------------------------------------------
    
    /**
     * Starts the verification process for the given CSS text.
     * @param {String} text The CSS text to verify.
     * @param {Object} rulesList (Optional) List of rules to apply. If null, then
     *      all rules are used.
     * @param {Object} options (Optional) Various options for the parser:
     *     starHack (true|false) to allow IE6 star hack as valid,
     *     underscoreHack (true|false) to interpret leading underscores
     *     as IE6-7 targeting for known properties, ieFilters (true|false)
     *     to indicate that IE < 8 filters should be accepted and not throw
     *     syntax errors.
     *     If null then the default options are used.
     * @return {Object} Results of the verification.
     * @method verify
     */
    api.verify = function(text, rulesList, options){
    
        var i        = 0,
            len      = rules.length,
            defaults = {
                starHack: true,
                ieFilters: true,
                underscoreHack: true,
                strict: false
            },
            reporter,
            lines,
            parser = new parserlib.css.Parser(options ? merge(defaults, options) : defaults);
        
        lines = text.split(/\n\r?/g);
        reporter = new Reporter(lines);
        
        if (!rulesList){												
            while (i < len){
                rules[i++].init(parser, reporter);
            }
        } else {
            for (i in rulesList){
                if(rulesList.hasOwnProperty(i)){
                    if (rules[i]){
                        rules[i].init(parser, reporter);
                    }
                }
            }
        }
        
        //capture most horrible error type
        try {
            parser.parse(text);
        } catch (ex) {
            reporter.error("Fatal error, cannot continue: " + ex.message, ex.line, ex.col);
        }
    
        return {
            messages    : reporter.messages,
            stats       : reporter.stats
        };
    };


    //-------------------------------------------------------------------------
    // Publish the API
    //-------------------------------------------------------------------------
    
    return api;

})();
