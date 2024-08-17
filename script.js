"use strict";

export let FOOD_JSON;
export let TYPES_OF_FOOD = [];
export function Capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function UndersoreString(string) {
    return string.split(" ").join("_");
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

    if (CURRENT_PAGE !== "index") {
        FOOD_JSON = await fetch_json(CURRENT_PAGE);

        FOOD_JSON.forEach((food) => {
            if (!TYPES_OF_FOOD.includes(food["type"])) {
                TYPES_OF_FOOD.push(food["type"]);
            }
        });
    }
    return CURRENT_PAGE;
}

async function Update_Quantity_localStorage(new_value, key) {
    const OBJECT_TO_EDIT = JSON.parse(localStorage.getItem(key));
    OBJECT_TO_EDIT["quantity"] = new_value;
    localStorage.setItem(key, JSON.stringify(OBJECT_TO_EDIT));
}

const CART_BODY = document.querySelector(".body_aside");

document.addEventListener("DOMContentLoaded", async () => {
    localStorage.removeItem("current_page");
    localStorage.removeItem("current-page");
    localStorage.removeItem("content");
    localStorage.removeItem("description");
    localStorage.removeItem("title");
    
    let values;

    async function initialize_Values_Events() {
        document.querySelectorAll(".value").forEach((value) => {
            value.addEventListener("input", (e) => {
                const PARENT_ELEM =
                    value.parentElement.parentElement.parentElement;
                const localStorage_KEY_CURRENT_ELEMENT = `to_cart_${UndersoreString(
                    PARENT_ELEM.querySelector("h4").textContent
                )}`;
                const NO_NUMBERS_PATTERN = new RegExp(/^[^0-9]+$/, "gmi");
                const DETECT_NUMBERS_PATTERN = new RegExp(/[0-9]/, "gm");
                if (NO_NUMBERS_PATTERN.test(value.value)) {
                    value.value = "";
                } else {
                    if (value.value.length > 0) {
                        value.value = Number(
                            value.value.match(DETECT_NUMBERS_PATTERN).join("")
                        );
                        Update_Quantity_localStorage(
                            value.value,
                            localStorage_KEY_CURRENT_ELEMENT
                        );
                        Update_checkout();
                    }
                }
            });

            value.addEventListener("blur", (e) => {
                const PARENT_ELEM =
                    value.parentElement.parentElement.parentElement;
                const localStorage_KEY_CURRENT_ELEMENT = `to_cart_${UndersoreString(
                    PARENT_ELEM.querySelector("h4").textContent
                )}`;
                if (value.value === "") {
                    value.value = "1";
                    Update_Quantity_localStorage(
                        "1",
                        localStorage_KEY_CURRENT_ELEMENT
                    );
                    Update_checkout();
                } else if (value.value === "0") {
                    localStorage.removeItem(
                        `to_cart_${UndersoreString(
                            PARENT_ELEM.querySelector("h4").textContent
                        )}`
                    );
                    PARENT_ELEM.remove();
                    if (CART_BODY.textContent === "") {
                        Reset_Cart(CART_BODY);
                    }
                }
            });

            value.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    value.blur();
                }
            });
        });
    }

    const CURRENT_PAGE = await initializeData();

    const {
        close_menu,
        adjustPadding,
        initializeDynamicContent,
        Update_Cart,
        Reset_Cart,
        Update_checkout,
    } = await import("./dinamic_adjusts.js");
    const { apply_filters, get_filters_settings, initializeFilters } =
        await import("./filters_settings.js");

    Update_Cart(CART_BODY);
    Update_checkout();
    await initialize_Values_Events();

    if (CURRENT_PAGE !== "index") {
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

        document
            .querySelector("#button_filter")
            .addEventListener("click", () => {
                const [
                    FILTER_INPUT,
                    FILTER_OPTIONS,
                    RESULTS_SECTION,
                    SECTIONS,
                ] = get_filters_settings();
                let options = [];
                FILTER_OPTIONS.forEach((option) =>
                    option.checked ? options.push(option) : null
                );
                RESULTS_SECTION.classList.remove("no_display");
                SECTIONS.forEach((section) =>
                    section.classList.add("no_display")
                );
                apply_filters(FILTER_INPUT, options, RESULTS_SECTION);
            });

        document
            .querySelector("#button_clear")
            .addEventListener("click", () => {
                const [
                    FILTER_INPUT,
                    FILTER_OPTIONS,
                    RESULTS_SECTION,
                    SECTIONS,
                ] = get_filters_settings();
                FILTER_INPUT.value = "";
                FILTER_OPTIONS.forEach((option) => (option.checked = false));
                SECTIONS.forEach((section) =>
                    section.classList.remove("no_display")
                );
                RESULTS_SECTION.querySelector(".grid_shop").childNodes.forEach(
                    (product) => {
                        if (
                            product.nodeName !== "#text" &&
                            product.nodeName !== "H3"
                        ) {
                            product.classList.add("no_display");
                        }
                    }
                );
                RESULTS_SECTION.classList.add("no_display");
            });

        document.querySelectorAll(".pick_item").forEach((button) => {
            button.addEventListener("click", () => {
                const SELECTED_ITEM = {
                    name: undefined,
                    description: undefined,
                    price: undefined,
                    image: undefined,
                    quantity: "1",
                };
                const PARENT_ELEM = button.parentElement.parentElement;
                SELECTED_ITEM["name"] =
                    PARENT_ELEM.querySelector("h4").textContent;
                SELECTED_ITEM["description"] =
                    PARENT_ELEM.querySelector("p").textContent;
                SELECTED_ITEM["price"] =
                    PARENT_ELEM.querySelector("span").textContent;
                SELECTED_ITEM["image"] = PARENT_ELEM.querySelector("img").src;
                localStorage.setItem(
                    `to_cart_${UndersoreString(
                        PARENT_ELEM.querySelector("h4").textContent
                    )}`,
                    JSON.stringify(SELECTED_ITEM)
                );
                Update_Cart(CART_BODY);
                Update_checkout();
                initialize_Values_Events();
            });
        });
    }
});
