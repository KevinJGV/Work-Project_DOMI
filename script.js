"use strict";

export let FOOD_JSON;
export let TYPES_OF_FOOD = [];
export function Capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export async function initializeData() {
    async function fetch_json(current_store) {
        return await fetch("./foods.json")
            .then((res) => res.json())
            .then((res) => res[current_store]);
    }

    function current_page() {
        return document.location.pathname
            .split("/")
            .pop()
            .split(".")
            .reverse()
            .pop();
    }
    const CURRENT_PAGE = current_page();
    FOOD_JSON = await fetch_json(CURRENT_PAGE);

    FOOD_JSON.forEach((food) => {
        if (!TYPES_OF_FOOD.includes(food["type"])) {
            TYPES_OF_FOOD.push(food["type"]);
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await initializeData();

    const { close_menu, adjustPadding, initializeDynamicContent } = await import("./dinamic_adjusts.js");
    const { apply_filters, get_filters_settings, initializeFilters } = await import("./filters_settings.js");

    await initializeFilters();
    await initializeDynamicContent();

    adjustPadding();

    document
        .querySelectorAll(".exit_aside")
        .forEach((button) => button.addEventListener("click", close_menu));

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
            RESULTS_SECTION,
            SECTIONS
        ] = get_filters_settings();
        let options = [];
        FILTER_OPTIONS.forEach((option) =>
            option.checked ? options.push(option) : null
        );
        RESULTS_SECTION.classList.remove("no_display");
        SECTIONS.forEach(section => section.classList.add("no_display"));
        apply_filters(FILTER_INPUT, options, RESULTS_SECTION);
    });

    document.querySelector("#button_clear").addEventListener("click", () => {
        const [
            FILTER_INPUT,
            FILTER_OPTIONS,
            RESULTS_SECTION,
            SECTIONS
        ] = get_filters_settings();
        FILTER_INPUT.value = "";
        FILTER_OPTIONS.forEach((option) => (option.checked = false));
        SECTIONS.forEach(section => section.classList.remove("no_display"));
        RESULTS_SECTION.querySelector(".grid_shop").childNodes.forEach(
            (product) => {
                if (product.nodeName !== "#text" && product.nodeName !== "H3") {
                    product.classList.add("no_display");
                }
            }
        );
        RESULTS_SECTION.classList.add("no_display");
    });
});
