// ==UserScript==
// @name         NTULearn Video Downloader
// @namespace    http://itachi1706.com/
// @version      1.1
// @description  Adds a download button to the NTULearn AcuLearn Video Interface
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/NTULearnVideoDownloader.user.js
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @match        https://*.ntu.edu.sg/aculearn*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var debug = true;
    var verbose = false;

    // Your code here...
    window.addEventListener('load', function() {
        initItems();
    }, false);

    // Inject Font Awesome
    if (debug) console.log("Injecting Font Awesome 5.6.3 Free Fonts");
    var link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://use.fontawesome.com/releases/v5.6.3/css/all.css';
    //link.integrity = 'sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/'; // Requires CORS
    link.crossorigin = 'anonymous';
    document.getElementsByTagName("HEAD")[0].appendChild(link);

    function initItems() {
        var videoControls = document.getElementsByClassName('vjs-control-bar')[0];
        var check = document.getElementById("Video1").tagName;
        if (check != "DIV") {
            console.log("Video Player has not been loaded yet. Retrying in 3 seconds...");
            setTimeout(initItems, 3000);
            return;
        }

        // Get data needed (if data not found we will gray out the controls)
        var titleContainer = document.getElementsByClassName('arv_title')[0];
        var videoTitle = 'video';
        if (titleContainer != null) {
            // Has title, retrieve as video title
            videoTitle = titleContainer.getElementsByClassName('vjs-modal-dialog-content')[0].innerText;

            //console.log("Video Data has not been loaded yet. Retrying in 3 seconds...");
            //setTimeout(initItems, 3000);
            //return;
        }

        // Get Video Info
        var videoURL = document.getElementById('Video1_html5_api').src;
        var formattedTitle = videoTitle.replace(/\((.*?)\)/g, '');
        formattedTitle = formattedTitle.trim();

        console.log("URL: " + videoURL);
        console.log("Video Title: " + videoTitle);
        console.log("Formatted Video Title: " + formattedTitle);
        console.log("File Name: " + formattedTitle + ".mp4");

        console.log("Injecting a download button into the video player");
        var settingCog = videoControls.getElementsByClassName('arv_setting')[0];
        if (debug && verbose) console.log(videoControls);
        if (debug && verbose) console.log(settingCog);

        // Create download var
        var download = document.createElement('a');
        download.className = 'vjs-control vjs-button';
        download.id = 'download-video-cus';
        download.title = 'Download Video'
        download.href = videoURL;
        download.download = formattedTitle + ".mp4";
        download.style.color = 'white';
        download.innerHTML = '<span aria-hidden="true" class="vjs-icon-placeholder fas fa-cloud-download-alt"></span><span class="vjs-control-text">Download</span>';
        if (debug && verbose) console.log(download);

        videoControls.insertBefore(download, settingCog);
    }
})();
