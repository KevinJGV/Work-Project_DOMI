"use strict";

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

export async function initializeDynamicContent() {
    const { FOOD_JSON, TYPES_OF_FOOD, Capitalize, UndersoreString } =
        await import("./script.js");

    const MAIN_ELEMENT = document.querySelector("main");
    const RESULTS_SECTION = document.querySelector("#results_grid");
    TYPES_OF_FOOD.forEach((type_of_food) => {
        const SECTION = document.createElement("section");
        const UNDERSCORED_TITLE = UndersoreString(type_of_food);
        if (type_of_food.includes(" ")) {
            SECTION.classList.add(UNDERSCORED_TITLE, "shop");
        } else {
            SECTION.classList.add(type_of_food, "shop");
        }
        const SECTION_TITLE = document.createElement("h2");
        SECTION_TITLE.textContent = Capitalize(type_of_food);
        const GRID = document.createElement("div");
        GRID.classList.add("grid", "grid_shop");
        for (const CURRENT_FOOD of FOOD_JSON) {
            if (CURRENT_FOOD["type"] === type_of_food) {
                const CARD_FOOD = create_card("section", type_of_food, UNDERSCORED_TITLE, CURRENT_FOOD);
                [GRID, RESULTS_SECTION].forEach((parent_elem) => {
                    const card_clone = CARD_FOOD.cloneNode(true);
                    parent_elem.insertAdjacentElement("beforeend", card_clone);
                });
            }
        }
        [SECTION_TITLE, GRID].forEach((elem) =>
            SECTION.insertAdjacentElement("beforeend", elem)
        );
        MAIN_ELEMENT.insertAdjacentElement("beforeend", SECTION);
    });
}

function create_card(motive, type_of_food, UNDERSCORED_TITLE, CURRENT_FOOD) {
    const CARD_FOOD = document.createElement("div");
    let card_clone;
    if (motive === "section") {
        if (type_of_food.includes(" ")) {
            CARD_FOOD.classList.add(UNDERSCORED_TITLE, "cart_item", "card");
        } else {
            CARD_FOOD.classList.add(type_of_food, "cart_item", "card");
        };
    } else {
        CARD_FOOD.classList.add("cart_item");
    };
    CARD_FOOD.classList.add("cart_item", "card");
    const CARD_FOOD_DATA = document.createElement("div");
    CARD_FOOD_DATA.classList.add("cart_item_data", "flex", "j_sb");
    const CARD_FOOD_DATA_TEXT = document.createElement("div");
    CARD_FOOD_DATA_TEXT.classList.add("cart_item_data_text");
    const H4 = document.createElement("h4");
    if (motive === "section") {
        H4.textContent = CURRENT_FOOD["name"];
    } else {
        H4.textContent = motive["name"];
    };
    const P = document.createElement("p");
    if (motive === "section") {
        P.textContent = CURRENT_FOOD["description"];
    } else {
        P.textContent = motive["description"];
    };
    [H4, P].forEach((elem) =>
        CARD_FOOD_DATA_TEXT.insertAdjacentElement("beforeend", elem)
    );
    const IMG = document.createElement("img");
    if (motive === "section") {
        IMG.src = CURRENT_FOOD["image"];
    } else {
        IMG.src = motive["image"];
    };
    [CARD_FOOD_DATA_TEXT, IMG].forEach((elem) =>
        CARD_FOOD_DATA.insertAdjacentElement("beforeend", elem)
    );
    const CARD_FOOD_FOOTER = document.createElement("div");
    CARD_FOOD_FOOTER.classList.add("cart_item_order", "flex", "j_sb");
    const PRICE = document.createElement("span");
    PRICE.classList.add("item_price");
    if (motive === "section") {
        PRICE.textContent = `$ ${CURRENT_FOOD["price"]} c/u`;
    } else {
        PRICE.textContent = motive["price"];
    };
    let button_or_input;
    if (motive === "section") {
        button_or_input = document.createElement("button");
        button_or_input.classList.add("pick_item");
        const STRONG = document.createElement("strong");
        STRONG.textContent = "+";
        button_or_input.insertAdjacentElement("beforeend", STRONG);
        button_or_input.insertAdjacentText("beforeend", " Agregar al carrito");
    } else {
        button_or_input = document.createElement("span");
        button_or_input.classList.add("item_quantity", "flex", "j_sa");
        const SPAN_P = document.createElement("p");
        SPAN_P.textContent = "Cantidad:";
        const INPUT = document.createElement("input");
        INPUT.type = "text";
        INPUT.classList.add("value");
        INPUT.value = "1";
        [SPAN_P,INPUT].forEach(elem => button_or_input.insertAdjacentElement("beforeend",elem));
    };
    [PRICE, button_or_input].forEach((elem) =>
        CARD_FOOD_FOOTER.insertAdjacentElement("beforeend", elem)
    );
    [CARD_FOOD_DATA, CARD_FOOD_FOOTER].forEach((elem) =>
        CARD_FOOD.insertAdjacentElement("beforeend", elem)
    );
    return CARD_FOOD
}

export function Update_Cart() {
    // debugger
    const CART_BODY = document.querySelector(".body_aside");
    CART_BODY.textContent = "";
    for (let i = 0; i < localStorage.length; i++) {
        const STORAGED_ITEM = JSON.parse(localStorage[localStorage.key(i)]);
        const CARD_CART = create_card(STORAGED_ITEM);
        CART_BODY.insertAdjacentElement("beforeend", CARD_CART);
    };
    CART_BODY.nextElementSibling.classList.remove("hidden");
}