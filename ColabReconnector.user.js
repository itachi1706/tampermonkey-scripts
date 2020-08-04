// ==UserScript==
// @name         Colab Auto-Reconnect
// @namespace    http://itachi1706.com/
// @version      0.1
// @description  Adds a basic button to toggle auto reconnection in Google Colab
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/ColabReconnector.user.js
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @match        https://colab.research.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let id = -1;

    let btn = document.createElement('button');
    btn.type = "button";
    btn.innerText = "Enable Auto-Reconnect";
    btn.onclick = function() {
        if (id === -1) startConnect();
        else clearConnect();
    }

    function clickConnect() {
        console.log("Clicked on connect button");
        document.querySelector("colab-connect-button").click();
        console.log(id);
    }

    function startConnect() {
        console.log("Starting connect");
        btn.innerText = "Enabling Auto-Reconnector every 15 seconds...";
        id = setInterval(clickConnect, 15000);
        setTimeout(function() { btn.innerText = "Disable Auto-Reconnect"; }, 2000);
    }

    function clearConnect() {
        console.log("Clearing connect");
        btn.innerText = "Disabling Auto-Reconnector...";
        setTimeout(function() { btn.innerText = "Enable Auto-Reconnect"; }, 2000);
        if (id === -1) return;
        clearInterval(id);
        id = -1;
    }

    function addButton() {
        var header = document.getElementById('header-right');
        if (header === null) {
            console.log("Not initialized. Waiting 2 seconds");
            setTimeout(addButton, 2000);
            return;
        }
        console.log("Initialized. Adding reconnect button");
        header.insertBefore(btn, header.firstChild);
    }

    window.onload = function() {
        console.log("onload");
        addButton();
    }

    console.log(id);


    // Your code here...
})();
