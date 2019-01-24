// ==UserScript==
// @name         GitHub Tools
// @namespace    http://itachi1706.com/
// @version      0.1
// @description  Small tweaks to GitHub for QoL improvements
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/GitHubTools.user.js
// @match        https://github.com/*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var debug = true;
    var verbose = false;
    console.log("Activating script " + GM_info.script.name + " by " + GM_info.script.author + ". Version: " + GM_info.script.version);
    var $ = window.jQuery;

    $(document).ready(function(){
        if ($) {
            console.log("jQuery is loaded"); // jQuery is loaded
            process();
        } else console.log("jQuery not found"); // jQuery is not loaded
    });


    function process() {
        var pathname = $(location).attr("pathname");
        if (debug) console.log(pathname);
        var paths = pathname.split('/');
        if (paths < 3) {
            // Invalid
            console.log("Not a valid URL to inject code comparision. Exiting");
            return;
        }
        var navBar = $(".reponav");
        if (debug) console.log(navBar);
        var hrefStr = '/' + paths[1] + '/' + paths[2] + '/compare';
        var compareImg = '<a id="octo-compare" class="js-selected-navigation-item reponav-item" href="' + hrefStr + '">' +
            '<svg class="octicon octicon-git-compare" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" ' +
            'd="M5 12H4c-.27-.02-.48-.11-.69-.31-.21-.2-.3-.42-.31-.69V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V11c.03.78.34 1.47.94 2.06.6.59 1.28.91 2.06.94h1v2l3-3-3-3v2zM2 1.8c.66 0 1.2.55 1.2 ' +
            '1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm11 9.48V5c-.03-.78-.34-1.47-.94-2.06-.6-.59-1.28-.91-2.06-.94H9V0L6 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 ' +
            '0 0 0 12 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>      Compare</a>';
        console.log("Injecting Compare Link");
        $(".reponav a:eq(5)").after(compareImg);
        checkIfCompareStillExists();
    }

    function checkIfCompareStillExists() {
        if (debug && verbose) console.log("Checking if compare icon exists...");
        var check = $("#octo-compare").length;
        if (check <= 0) {
            console.log("Compare Link Lost. Reinjecting into page");
            process();
        } else {
            if (debug && verbose) console.log("Exists. Checking again in 5 seconds");
            setTimeout(checkIfCompareStillExists, 5000); // Check every 5 seconds
        }
    }

})();
