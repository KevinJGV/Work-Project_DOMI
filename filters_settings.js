'use strict';

export function apply_filters(filter_input, options, results_section) {
    function comparing_strings(string_to_compare, comparer) {
        string_to_compare = string_to_compare.trim();
        comparer = comparer.trim();
        if (comparer === "" || string_to_compare === "") return false;
        comparer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(comparer, "i").test(string_to_compare);
    };
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
            }
        }
    });
    if (!coincidencia) {
        GRID_PRODUCTS.style["grid-template-columns"] = "1fr";
        GRID_PRODUCTS.childNodes.forEach((product) => {
            if (product.nodeName !== "#text" && product.nodeName !== "H3")
                product.classList.add("no_display");
        });
        GRID_PRODUCTS.children[0].classList.remove("no_display");
    } else {
        GRID_PRODUCTS.style["grid-template-columns"] = "repeat(3, 1fr)";
        GRID_PRODUCTS.children[0].classList.add("no_display");
    }
}

export function get_filters_settings(motive) {
    const FILTER_INPUT = document.querySelector("#filter_search");
    const FILTER_OPTIONS = document.querySelectorAll(
        ".filter_label_options input"
    );
    const POPULAR_SECTION = document.querySelector(".popular");
    const NEW_SECTION = document.querySelector(".new");
    const RESULTS_SECTION = document.querySelector(".results");
    return [
        FILTER_INPUT,
        FILTER_OPTIONS,
        POPULAR_SECTION,
        NEW_SECTION,
        RESULTS_SECTION,
    ];
}