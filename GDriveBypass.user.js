// ==UserScript==
// @name         For the lolz. Bypassing Google Drive Download Disabling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypasses GDrive disabling of download/save/copy. Press 'A' when you are done downloading
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/GDriveBypass.user.js
// @match        https://drive.google.com/drive/**/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.0.2/jszip-utils.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var blobs = [];

    document.addEventListener('keydown', function(event) {
    if (event.keyCode == 65) {
        var zip = new JSZip();
        var count = 0;
        var lol = blobs.length;
        console.log("Total Pages: " + lol);
        blobs.forEach(function(e) {
            console.log("Processing: " + count);
            var filename = (count + 1) + "";
            if (e.type == 'image/webp') {
                // Process webp base64
                filename += ".webp";
            } else if (e.type == 'image/png') {
                // Process png base64
                filename += ".png";
            } else {
                filename += ".dat";
            }
            zip.file(filename, e);
            count++;
            if (count == lol) {
                zip.generateAsync({ type: 'blob' }).then(function(content) {
                        var zipName = "blob.zip";
                        saveAs(content, zipName);
                    });
            }
        });
    }
}, true);

    // Your code here...
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {

            if (this.responseType === 'blob') {
                //console.log(this.response);
                //console.log(this.response.type);
                blobs.push(this.response);
            }
        });
        origOpen.apply(this, arguments);
    };
})();
