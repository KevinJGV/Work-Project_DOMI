'use strict';

export function close_menu() {
    const checkboxes = document.querySelectorAll(".toggle_aside");
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
}

export function adjustPadding() {
    const navbarHeight = window.outerHeight - window.innerHeight;
    const footer = document.querySelector("footer");
    footer.style.paddingBottom = navbarHeight + "px";
    const asideElements = document.querySelectorAll("aside");
    asideElements.forEach(
        (aside) => (aside.style.paddingBottom = navbarHeight + "px")
    );
}