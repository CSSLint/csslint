/*
 * Utility functions that make life easier.
 */
CSSLint.Util = {
    /*
     * Adds all properties from supplier onto receiver,
     * overwriting if the same name already exists on
     * receiver.
     * @param {Object} The object to receive the properties.
     * @param {Object} The object to provide the properties.
     * @return {Object} The receiver
     */
    mix: function(receiver, supplier) {
        "use strict";
        var prop;

        for (prop in supplier) {
            if (supplier.hasOwnProperty(prop)) {
                receiver[prop] = supplier[prop];
            }
        }

        return prop;
    },

    /*
     * Polyfill for array indexOf() method.
     * @param {Array} values The array to search.
     * @param {Variant} value The value to search for.
     * @return {int} The index of the value if found, -1 if not.
     */
    indexOf: function(values, value) {
        "use strict";
        if (values.indexOf) {
            return values.indexOf(value);
        } else {
            for (var i=0, len=values.length; i < len; i++) {
                if (values[i] === value) {
                    return i;
                }
            }
            return -1;
        }
    },

    /*
     * Polyfill for array forEach() method.
     * @param {Array} values The array to operate on.
     * @param {Function} func The function to call on each item.
     * @return {void}
     */
    forEach: function(values, func) {
        "use strict";
        if (values.forEach) {
            return values.forEach(func);
        } else {
            for (var i=0, len=values.length; i < len; i++) {
                func(values[i], i, values);
            }
        }
    }
};
