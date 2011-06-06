

/**
 * An instance of Report is used to report results of the
 * verification back to the main API.
 * @class Reporter
 */
function Reporter(){

    /**
     * List of messages being reported.
     * @property messages
     * @type String[]
     */
    this.messages = [];
    
    /**
     * List of statistics being reported.
     * @property stats
     * @type String[]
     */
    this.stats = [];   

}

Reporter.prototype = {

    //restore constructor
    constructor: Reporter,
    
    /**
     * Report an error.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @method error
     */
    error: function(message, line, col){
        this.messages.push({
            type    : "error",
            line    : line,
            col     : col,
            message : message            
        });
    },
    
    /**
     * Report an warning.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @method warn
     */
    warn: function(message, line, col){
        this.messages.push({
            type    : "warning",
            line    : line,
            col     : col,
            message : message            
        });
    },
    
    /**
     * Report some informational text.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @method info
     */
    info: function(message, line, col){
        this.messages.push({
            type    : "info",
            line    : line,
            col     : col,
            message : message            
        });
    },
    
    /**
     * Report some rollup error information.
     * @param {String} message The message to store.
     * @method rollupError
     */
    rollupError: function(message){
        this.messages.push({
            type    : "error",
            rollup  : true,
            message : message            
        });
    },
    
    /**
     * Report some rollup warning information.
     * @param {String} message The message to store.
     * @method rollupWarn
     */
    rollupWarn: function(message){
        this.messages.push({
            type    : "warn",
            rollup  : true,
            message : message            
        });
    },
    
    /**
     * Report a statistic.
     * @param {String} name The name of the stat to store.
     * @param {Variant} value The value of the stat.
     * @method stat
     */
    stat: function(name, value){
        this.stats[name] = value;
    }
};
