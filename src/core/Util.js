/*
 * Utility functions that make life easier.
 */

/*
 * Adds all properties from supplier onto receiver,
 * overwriting if the same name already exists on
 * reciever.
 * @param {Object} The object to receive the properties.
 * @param {Object} The object to provide the properties.
 * @return {Object} The receiver
 */
function mix(reciever, supplier){
    var prop;
    
    for (prop in supplier){
        if (supplier.hasOwnProperty(prop)){
            receiver[prop] = supplier[prop];
        }
    }
    
    return prop;
}

