// ==UserScript==
// @name         GitHub Tools
// @namespace    http://itachi1706.com/
// @version      1.6
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
    var debug = false;
    var verbose = false;
    var compareFailureCount = 0; // If it exceeds 10 we stop trying since there is no point lol
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
        if (paths.length < 3) {
            // Invalid
            console.log("Not a valid URL to inject code comparision. Exiting");
            return;
        }
        if (paths[1] == "settings") {
            console.log("Detected User Settings. Exiting");
            return;
        }
        if (paths[3] == "search") {
            console.log("Detected search screen. Exiting");
            return;
        }
        var navBar = $(".reponav");
        if (debug) console.log(navBar);
        if (debug) console.log(paths);
        // Trying to find insight to insert after. Otherwise insert before settings, otherwise insert at end
        var iInto = null;
        var iBefore = false;
        $(navBar).children().each(function(i, element) {
            if (debug && verbose) console.log(element);
            iInto = element; // Always insert after the last element if all is not met
            if ($(element).text().indexOf("Insights") >= 0) {
                console.log("Found Insights, will add compare to the right of it");
                iInto = element;
                return false;
            } else if ($(element).text().indexOf("Settings") >= 0) {
                console.log("Found Settings, will add compare to the left of it");
                iInto = element;
                iBefore = true;
                return false;
            }
        });

        var hrefStr = '/' + paths[1] + '/' + paths[2] + '/compare';
        var compareImg = '<a id="octo-compare" class="js-selected-navigation-item reponav-item" href="' + hrefStr + '">' +
            '<svg class="octicon octicon-git-compare" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" ' +
            'd="M5 12H4c-.27-.02-.48-.11-.69-.31-.21-.2-.3-.42-.31-.69V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V11c.03.78.34 1.47.94 2.06.6.59 1.28.91 2.06.94h1v2l3-3-3-3v2zM2 1.8c.66 0 1.2.55 1.2 ' +
            '1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm11 9.48V5c-.03-.78-.34-1.47-.94-2.06-.6-.59-1.28-.91-2.06-.94H9V0L6 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 ' +
            '0 0 0 12 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>      Compare</a>';
        console.log("Injecting Compare Link");
        compareFailureCount = 0; // Reset to 0
        if (!iBefore) $(iInto).after(compareImg);
        else $(iInto).before(compareImg);
        checkIfCompareStillExists();

        // Check if on release page
        if (paths.length >= 4 && paths[3] == 'releases') {
            console.log("On Release page, processing releases plugin");
            processReleaseCommits(paths);
        }
    }

    function checkIfCompareStillExists() {
        if (debug && verbose) console.log("Checking if compare icon exists...");
        var check = $("#octo-compare").length;
        if (check <= 0 && compareFailureCount <= 10) {
            compareFailureCount++;
            console.log("Compare Link Lost. Reinjecting into page");
            process();
        } else if (compareFailureCount > 10) console.log("Compare check failed 10 times. Stopping attempts to inject the link in");
        else {
            if (debug && verbose) console.log("Exists. Checking again in 5 seconds");
            setTimeout(checkIfCompareStillExists, 5000); // Check every 5 seconds
        }
    }

    function logCommits(tag, count) {
        if (debug) console.log("Commits to master since " + tag + ": " + count.trim());
    }

    function processReleaseCommits(paths) {
        var releases = $(".release-entry .release.label-latest, .release-entry .release.label-");
        $.each(releases, function(index,value) {
            if (debug && verbose) console.log(index + ": " + value);
            var tag = $(value).find(".d-none li.d-block span.css-truncate-target");
            if (debug && verbose) console.log("Tag: " + $(tag).text());
            var compareStr = $(tag).text() + "...master";
            var compareURL = "/" + paths[1] + "/" + paths[2] + "/compare/" + compareStr;
            var entry = $(value).find(".release-header .f5");
            if ($(entry).text().includes("since this release") !== true) {
                var append = "<span id='edit-" + index + "' class='text-gray'>·\tLoading commits since this release...</span>";
                $(entry).append(append);
                $(entry).find('#edit-' + index).load(compareURL, function(data) {
                    var result = ''; // Used to print the final information

                    // If there are too many commits check
                    var tooManyCommits = $(data).find(".tabnav a:eq(0) .Counter");
                    if (tooManyCommits.length != 0) {
                        result = '·\t<a href=' + compareURL + '>' + tooManyCommits.text() + ' commits</a> to master since this release';
                        logCommits(tag.text(), tooManyCommits.text());
                    }
                    else {
                        // Check for few commits
                        var someCommits = $(data).find(".numbers-summary li:eq(0) .num.text-emphasized");
                        if (someCommits.length != 0) {
                            var c = (parseInt(someCommits.text()) == 1) ? 'commit' : 'commits';
                            result = '·\t<a href=' + compareURL + '>' + someCommits.text() + ' ' + c + '</a> to master since this release';
                            logCommits(tag.text(), someCommits.text());
                        } else logCommits(tag.text(), "0");
                    }

                    $('#edit-' + index).html(result);

                });
            }
        });
    }

})();
