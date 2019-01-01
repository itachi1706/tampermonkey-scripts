// ==UserScript==
// @name         Server Time
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Guesstimate Server Time for NTU STARS Server
// @updateURL    https://github.com/itachi1706/tampermonkey-scripts/raw/master/ServerTime.user.js
// @author       Kenneth Soh (itachi1706)
// @match        https://wish.wis.ntu.edu.sg/pls/webexe/AUS_STARS_PLANNER.planner
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var datestring = req.getResponseHeader("date");
    console.log("Response date: " + datestring);
    var currentDate = new Date(datestring);
    var newHTML = document.createElement('div');
    let datetimeoptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: false,
    timeZone: 'Asia/Singapore'
};
    newHTML.innerHTML = '<p style="font-size:13px;">Server Time: ' + datestring + '</p>';
    var element = document.getElementById("ui_nav_left");
    element.appendChild(newHTML);
    setInterval(function() {
        currentDate.setSeconds(currentDate.getSeconds() + 1);// += second;
        newHTML.innerHTML = '<p style="font-size:13px;">Server Time: ' + currentDate.toLocaleString('en-sg', datetimeoptions) + '</p>';
    }, 1000);
})();
