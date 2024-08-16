"use strict";

export function apply_filters(filter_input, options, results_section) {
    function comparing_strings(string_to_compare, comparer) {
        string_to_compare = string_to_compare.trim();
        comparer = comparer.trim();
        if (comparer === "" || string_to_compare === "") return false;
        comparer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(comparer, "i").test(string_to_compare);
    }
    let coincidencia = false;
    const GRID_PRODUCTS = results_section.querySelector(".grid_shop");
    GRID_PRODUCTS.childNodes.forEach((product) => {
        if (product.nodeName !== "#text" && product.nodeName !== "H3") {
            let option_finded;
            for (let option of options) {
                if (product.classList.contains(option.value))
                    option_finded = option.value;
            }
            if (
                comparing_strings(
                    product.querySelector("h4").textContent.toLowerCase(),
                    filter_input.value.toLowerCase()
                ) ||
                comparing_strings(
                    product.querySelector("p").textContent.toLowerCase(),
                    filter_input.value.toLowerCase()
                ) ||
                option_finded
            ) {
                product.classList.remove("no_display");
                coincidencia = true;
            } else {
                product.classList.add("no_display");
            }
        }
    });
    if (!coincidencia) {
        GRID_PRODUCTS.style.setProperty('grid-template-columns', '1fr', 'important');
        GRID_PRODUCTS.childNodes.forEach((product) => {
            if (product.nodeName !== "#text" && product.nodeName !== "H3")
                product.classList.add("no_display");
        });
        GRID_PRODUCTS.children[0].classList.remove("no_display");
    } else {
        GRID_PRODUCTS.removeAttribute('style');
        GRID_PRODUCTS.children[0].classList.add("no_display");
    }
}

export function get_filters_settings() {
    function evaluation(section) {
        if (section.classList.contains("brand_label") || section.classList.contains("filter_label") || section.classList.contains("results")) {
            return false
        };
        return true
    };
    const FILTER_INPUT = document.querySelector("#filter_search");
    const FILTER_OPTIONS = document.querySelectorAll(
        ".filter_label_options input"
    );
    let sections = [];
    const MAIN = document.querySelector("main").children;
    for (const section of MAIN) {
        if (evaluation(section)) {
            sections.push(section)
        }
    };
    const RESULTS_SECTION = document.querySelector(".results");
    return [FILTER_INPUT,FILTER_OPTIONS, RESULTS_SECTION,sections]
}

export async function set_filters_from_json() {
    const { TYPES_OF_FOOD, Capitalize, UndersoreString } = await import("./script.js");

    const FILTERS_BUTTONS = document.querySelectorAll(".filter");
    let counter = 0;
    FILTERS_BUTTONS.forEach((button) => {
        if (TYPES_OF_FOOD[counter].includes(" ")) {
            button.value = UndersoreString(TYPES_OF_FOOD[counter]), "shop";
        } else {
            button.value = TYPES_OF_FOOD[counter], "shop";
        }
        button.nextElementSibling.textContent = Capitalize(
            TYPES_OF_FOOD[counter]
        );
        counter++;
    });
}

export async function initializeFilters() {
    await set_filters_from_json();
}