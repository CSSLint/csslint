/*
 * Web worker for CSSLint
 */

//message indicates to start linting
self.onmessage = function(event){
    
    var text    = event.data,
        results = CSSLint.verify(text);
        
    //Not all browsers support structured clone, so JSON stringify results
    self.postMessage(JSON.stringify(results));
};