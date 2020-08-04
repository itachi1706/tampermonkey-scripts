// ==UserScript==
// @name         Colab Auto-Reconnect
// @namespace    http://itachi1706.com/
// @version      1.0
// @description  Adds a basic button to toggle auto reconnection in Google Colab
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/ColabReconnector.user.js
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @match        https://colab.research.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Localization
    const txtEnable = "Enable Auto-Reconnect";
    const txtEnabling = "Enabled!";
    const txtDisable = "Disable Auto-Reconnect";
    const txtDisabling = "Disabled!";
    const txtEnableTooltip = "Enables a 15 seconds automatic reconnector";
    const txtDisableTooltip = "Disables automatic reconnector";
    // End of localization

    let id = -1;

    let btn = document.createElement('paper-button');
    let icon = document.createElement('iron-icon');
    let btnspan = document.createElement('span');
    icon.icon = "refresh";
    btnspan.innerText = txtEnable;
    btn.setAttribute("command", "noop");
    btn.id = "autoreload";
    btn.onclick = function() {
        if (id === -1) startConnect();
        else clearConnect();
    }

    let tooltip = document.createElement('paper-tooltip');
    let tooltiptext = document.createElement('div');
    tooltip.setAttribute("for", "autoreload");
    tooltiptext.className = "tooltip-with-shortcut";
    tooltiptext.innerText = txtEnableTooltip;
    tooltip.id = "autoreload-tooltip";

    function clickConnect() {
        console.log("Clicked on connect button");
        document.querySelector("colab-connect-button").click();
        console.log(id);
    }

    function startConnect() {
        console.log("Starting connect");
        btnspan.innerText = txtEnabling;
        tooltiptext.innerText = txtDisableTooltip;
        icon.icon = "check"
        id = setInterval(clickConnect, 15000);
        setTimeout(function() { btnspan.innerText = txtDisable; icon.icon = "refresh"; }, 500);
    }

    function clearConnect() {
        console.log("Clearing connect");
        btnspan.innerText = txtDisabling;
        tooltiptext.innerText = txtEnableTooltip;
        icon.icon = "clear";
        setTimeout(function() { btnspan.innerText = txtEnable; icon.icon = "refresh" }, 500);
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
        let child = header.firstChild;
        header.insertBefore(btn, child);
        btn.appendChild(icon);
        btn.appendChild(btnspan);
        header.insertBefore(tooltip, child);
        tooltip.appendChild(tooltiptext);
    }

    window.onload = function() {
        console.log("onload");
        addButton();
    }

    console.log(id);


    // Your code here...
})();
