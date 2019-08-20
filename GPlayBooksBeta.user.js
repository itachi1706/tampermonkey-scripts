// ==UserScript==
// @name         Google Play Books Beta Features Handling
// @namespace    http://itachi1706.com/
// @version      0.1-beta
// @description  This script improves on the current Google Play Books BETA features like custom shelves (As of 20 August 2019)
// @author       Kenneth Soh (itachi1706) <kenneth@itachi1706.com>
// @match        https://play.google.com/books*
// @exclude      https://play.google.com/books/reader*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var debug = false;

    function itemClick(e) {
        if (debug) console.log("onChange Called");
        if (debug) console.log(e);
        var combo = e.srcElement;
        var index = combo.selectedIndex;
        var objSelected = combo.options[index];
        if (objSelected.value === '') { console.log("No values. Presuming default."); return; }
        if (debug) console.log(objSelected.innerText, " | ", objSelected.value);
        console.log("Navigating to", objSelected.innerText);
        window.location.href = objSelected.value;
    }

    function refresh(combobox) {
        // Set loading state
        combobox.innerHTML = '';
        var loading = document.createElement('option');
        loading.value = "";
        loading.innerText = "Loading Shelves...";
        combobox.add(loading);
    }

    function refreshCategories() {
        var shelfList = document.getElementsByClassName('navbar-shelf-link');
        if (debug) console.log(shelfList);
        var combo = document.getElementById('category-selector');


        // Parse Shelf
        combo.innerHTML = ''; // Clear the whole thing
        combo.onchange = 'refreshCategories';
        var text = [];
        // Add your own "Select One" option
        var defaultOpt = document.createElement('option');
        defaultOpt.innerText = "Choose a Shelf";
        defaultOpt.value = '';
        text.push(defaultOpt.innerText);
        combo.add(defaultOpt);
        [].forEach.call(shelfList, function(element) {
            var childObj = element.children[0];
            if (debug) console.log("Category:", childObj.innerText, " | URL:", childObj.href);
            var option = document.createElement('option');
            option.value = childObj.href;
            option.innerText = childObj.innerText;
            text.push(childObj.innerText);
            combo.add(option);
        });
        var currentCategory = document.getElementsByClassName('header')[0].children[0].children[0].innerText;
        console.log("Current Shelf found:", currentCategory);
        if (debug) console.log(text);
        if (debug) console.log("Selected Index: ", text.indexOf(currentCategory));
        var index = text.indexOf(currentCategory);
        combo.selectedIndex = (index === -1) ? 0 : index;
    }

    window.invokeRefreshCat = function() {
        var combo = document.getElementById('category-selector');
        refresh(combo);
        console.log("Updating Shelves");
        setTimeout(refreshCategories, 2000);
    }

    window.addEventListener('load', function() {
        setTimeout(initItems, 3000);
    }, false);

    function existenceCheck() {
        if (debug) console.log("Conducting Existence Check for custom elements...");
        if (document.getElementById('category-selector') === null) { console.log("Dropdown Box disappeared, recreating..."); initComboBox(); refreshCategories(); }
        if (document.getElementById('refresh-shelf-beta') === null) { console.log("Refresh Button disappeared, recreating..."); initButton(); }
        setTimeout(existenceCheck, 10000); // 10 seconds check
    }

    function initComboBox() {
        var divider = document.getElementsByClassName('navbar-divider')[0];
        var combobox = document.createElement('select');
        combobox.id = "category-selector";
        combobox.style.marginLeft = '15px';
        combobox.style.marginBottom = '10px';
        combobox.style.maxWidth = '170px';
        divider.after(combobox);

        combobox.addEventListener('change', itemClick);
        refresh(combobox);
    }

    function initButton() {
        var buttons = document.getElementsByClassName('books-button');
        var created = false;
        [].forEach.call(buttons, function(button) {
            if (button.innerText.toLowerCase() === 'upload files') {
                // Get the attributes to clone
                console.log("Injecting Refresh Button");
                var btn = button.cloneNode();
                btn.innerText = "Refresh Shelves";
                btn.className = "books-button refresh-shelf-button";
                btn.id = 'refresh-shelf-beta';
                button.parentElement.insertBefore(btn, button);
                btn.addEventListener('click', window.invokeRefreshCat);
                created = true;
                return;
            }
        });

        if (created) return;

        // No such button, use gear icon
        var gearButtons = document.getElementsByClassName('gear-button');
        [].forEach.call(gearButtons, function(button) {
            if (button.title === 'Settings') {
                // Get the attributes to clone
                console.log("Injecting Refresh Button beside Settings");
                var btn = button.cloneNode();
                btn.innerText = "Refresh Shelves";
                btn.className = "books-button refresh-shelf-button";
                btn.id = 'refresh-shelf-beta';
                button.parentElement.insertBefore(btn, button);
                btn.addEventListener('click', window.invokeRefreshCat);
                return;
            }
        });
    }

    function initItems() {
        initComboBox();

        console.log("Generating Shelf List after 5 seconds");
        setTimeout(refreshCategories, 5000);

        initButton();
        setTimeout(existenceCheck, 10000);
    }
})();
