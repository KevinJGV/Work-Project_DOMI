"use strict";

import {close_menu, adjustPadding} from "./dinamic_adjusts.js";
import {apply_filters, get_filters_settings} from "./filters_settings.js";

adjustPadding();

document.querySelectorAll(".exit_aside").forEach(button => button.addEventListener("click", close_menu));

window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    const scrollTop = window.scrollY;
    if (scrollTop > 0) {
        header.style.top = "0";
    } else {
        header.style.top = "0";
    }
});

document.querySelector("#button_filter").addEventListener("click", () => {
    const [
        FILTER_INPUT,
        FILTER_OPTIONS,
        POPULAR_SECTION,
        NEW_SECTION,
        RESULTS_SECTION,
    ] = get_filters_settings();
    let options = [];
    FILTER_OPTIONS.forEach((option) =>
        option.checked ? options.push(option) : null
    );
    NEW_SECTION.classList.add("no_display");
    POPULAR_SECTION.classList.add("no_display");
    RESULTS_SECTION.classList.remove("no_display");
    apply_filters(FILTER_INPUT, options, RESULTS_SECTION);
});

document.querySelector("#button_clear").addEventListener("click", () => {
    const [
        FILTER_INPUT,
        FILTER_OPTIONS,
        POPULAR_SECTION,
        NEW_SECTION,
        RESULTS_SECTION,
    ] = get_filters_settings();
    FILTER_INPUT.value = "";
    FILTER_OPTIONS.forEach((option) => (option.checked = false));
    NEW_SECTION.classList.remove("no_display");
    POPULAR_SECTION.classList.remove("no_display");
    RESULTS_SECTION.querySelector(".grid_shop").childNodes.forEach(
        (product) => {
            if (product.nodeName !== "#text" && product.nodeName !== "H3") {
                product.classList.add("no_display");
            }
        }
    );
    RESULTS_SECTION.classList.add("no_display");
});

