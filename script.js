"use strict";

function close_menu() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
}

function adjustPadding() {
    const navbarHeight = window.outerHeight - window.innerHeight;
    const footer = document.querySelector("footer");
    footer.style.paddingBottom = navbarHeight + "px";
    const asideElements = document.querySelectorAll("aside");
    asideElements.forEach(
        (aside) => (aside.style.paddingBottom = navbarHeight + "px")
    );
}

adjustPadding();
document.addEventListener("resize", adjustPadding);

window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    const scrollTop = window.scrollY;
    if (scrollTop > 0) {
        header.style.top = "0";
    } else {
        header.style.top = "0";
    }
});

function get_filters_settings(motive) {
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

function apply_filters(filter_input, options, results_section) {
    let coincidencia = false;
    const GRID_PRODUCTS = results_section.querySelector(".grid_shop");
    GRID_PRODUCTS.childNodes.forEach((product) => {
        if (product.nodeName !== "#text" && product.nodeName !== "H3") {
            let option_finded;
            for (let option of options) {
                if (product.classList.contains(option.value))
                    option_finded = option.value;
            }
            debugger;
            PROBLEMA DE CONDICIONALES PENDIENTE
            if (
                (product.querySelector("h4").textContent.length >=
                    filter_input.value.length &&
                    product
                        .querySelector("h4")
                        .textContent.toLowerCase()
                        .includes(filter_input.value.toLowerCase())) ||
                (product.querySelector("p").textContent.length >=
                    filter_input.value.length &&
                    product
                        .querySelector("p")
                        .textContent.toLowerCase()
                        .includes(filter_input.value.toLowerCase())) ||
                option_finded
            ) {
                product.classList.remove("no_display");
                coincidencia = true;
            }
        }
    });
    if (!coincidencia) {
        GRID_PRODUCTS.style["grid-template-columns"] = "1fr";
        GRID_PRODUCTS.children[0].classList.remove("no_display");
    } else {
        GRID_PRODUCTS.children[0].classList.add("no_display");
    }
}

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
    RESULTS_SECTION.querySelector(".grid_shop").forEach((product) =>
        product.classList.add("no_display")
    );
    RESULTS_SECTION.classList.add("no_display");
});
