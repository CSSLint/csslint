/*
 * Web worker for CSSLint
 */

//message indicates to start linting
self.onmessage = function(event){
    
    var text    = (typeof event.data == "string") ? event.data : event.data.text,
        options = event.data.options,
        results = CSSLint.verify(text);
        
    self.postMessage(results);
};