/* jshint browser:true */
(function() {
    "use strict";

    window.onload = function() {
        document.body.onclick = function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement,
                results,
                messages,
                i,
                len;

            function log(value, level) {
                var output = document.getElementById("output");
                output.innerHTML += "<span class=\"" + level + "\">" + value.replace(/ /g, "&nbsp;") + "</span><br>";
            }

            if (target.id === "lint-btn") {
                document.getElementById("output").innerHTML = "";
                results = CSSLint.verify(document.getElementById("input").value);
                messages = results.messages;
                for (i=0, len=messages.length; i < len; i++) {
                    log(messages[i].message + " (line " + messages[i].line + ", col " + messages[i].col + ")", messages[i].type);
                }

            }

        };
    };
})();
