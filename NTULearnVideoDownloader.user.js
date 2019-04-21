// ==UserScript==
// @name         NTULearn Video Downloader
// @namespace    http://itachi1706.com/
// @version      1.5
// @description  Adds a download button to the NTULearn AcuLearn Video Interface
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/NTULearnVideoDownloader.user.js
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @match        https://*.ntu.edu.sg/aculearn*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`.arv_quality.vjs-hidden, .arv_rate.vjs-hidden, .arv_subtitle.vjs-hidden { display: block !important; right: -18em; }`);

(function() {
    'use strict';

    var debug = false;
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
        var video = document.getElementById('Video1_html5_api');
        var videoURL = video.src;
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

        // Disable right click prevention
        var bod = document.getElementsByTagName('body')[0];
        if (debug && verbose) console.log(bod);
        if (bod != null && bod.oncontextmenu != null) {
            console.log("Resetting right click prevention in LAMS Videos");
            bod.oncontextmenu = null;
        }

        if (video != null) {
            console.log("Found video object, injecting custom speed handler");
            customSpeedInject(video, videoControls);
        }
    }

    function customSpeedInject(video, control) {
        if (debug && verbose) console.log(video);
        var menu = control.getElementsByClassName('arv_menu')[0];
        if (debug && verbose) console.log(menu);
        var speedArr = menu.getElementsByClassName('vjs-menu-item');
        if (debug && verbose) console.log(speedArr);
        var speed = null;
        for (let element of speedArr) {
            if (debug && verbose) console.log(element);
            if (element.childNodes[0].innerText == "Speed") {
                speed = element;
            }
        }
        if (speed == null) {
            console.log("Unable to find speed toggle, disabling speed handler");
            return;
        }
        if (debug && verbose) console.log(speed);
        var speedText = speed.childNodes[1];
        console.log("Current Video Speed: " + speedText.innerText.substring(0, speedText.innerText.length - 2));

        var speedMenu = control.getElementsByClassName('arv_rate')[0];
        if (debug && verbose) console.log(speedMenu);
        var customSpeedBox = document.createElement('input');
        customSpeedBox.innerText = "Help la";
        customSpeedBox.className = "vjs-menu-item";
        customSpeedBox.placeholder = "Custom Speed (0.1 - 10)"; // Note: Anything above 4 will not have sound
        // Try and add an event handler
        customSpeedBox.addEventListener("keyup", function(event) {
            event.preventDefault(); // Cancel the default action, if needed
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                var val = customSpeedBox.value;
                if (debug) console.log("Entered value: " + val);
                var num = parseFloat(val);
                if (isNaN(num)) {
                    alert("You have not entered a valid number. Please enter a number from 0.1 - 10");
                    return;
                }
                if (debug) console.log("Parsed Number: " + num);
                if (num < 0.1 || num > 10) {
                    alert("Invalid range. Please enter a number from 0.1 - 10");
                    return;
                }

                console.log("Attempting to set custom video speed at " + num + "x");
                speedText.innerText = "Custom (" + num + "x) >";
                video.playbackRate = num;
            }
        });

        speedMenu.appendChild(customSpeedBox);
    }
})();
