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
    console.log("🔧 Starting initializeDynamicContent");
    
    const { FOOD_JSON, TYPES_OF_FOOD, Capitalize, UndersoreString } =
        await import("./script.js");

    if (!FOOD_JSON || FOOD_JSON.length === 0) {
        console.error("❌ No food data available");
        return;
    }

    const MAIN_ELEMENT = document.querySelector("main");
    const RESULTS_SECTION = document.querySelector("#results_grid");
    
    if (!MAIN_ELEMENT || !RESULTS_SECTION) {
        console.error("❌ Required DOM elements not found");
        return;
    }

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
        
        let itemCount = 0;
        for (const CURRENT_FOOD of FOOD_JSON) {
            if (CURRENT_FOOD["type"] === type_of_food) {
                const CARD_FOOD = create_card(
                    "section",
                    type_of_food,
                    UNDERSCORED_TITLE,
                    CURRENT_FOOD
                );
                [GRID, RESULTS_SECTION].forEach((parent_elem) => {
                    const card_clone = CARD_FOOD.cloneNode(true);
                    parent_elem.insertAdjacentElement("beforeend", card_clone);
                });
                itemCount++;
            }
        }
        
        console.log(`✅ Added ${itemCount} items for ${type_of_food}`);
        
        [SECTION_TITLE, GRID].forEach((elem) =>
            SECTION.insertAdjacentElement("beforeend", elem)
        );
        MAIN_ELEMENT.insertAdjacentElement("beforeend", SECTION);
    });
    
    console.log("✅ Dynamic content initialization complete");
}

function create_card(motive, type_of_food, UNDERSCORED_TITLE, CURRENT_FOOD) {
    const CARD_FOOD = document.createElement("div");
    let card_clone;
    if (motive === "section") {
        CARD_FOOD.classList.add("cart_item", "card");
        if (type_of_food.includes(" ")) {
            CARD_FOOD.classList.add(UNDERSCORED_TITLE);
        } else {
            CARD_FOOD.classList.add(type_of_food);
        }
    } else {
        CARD_FOOD.classList.add("cart_item", "card");
    }
    const CARD_FOOD_DATA = document.createElement("div");
    CARD_FOOD_DATA.classList.add("cart_item_data", "flex", "j_sb");
    const CARD_FOOD_DATA_TEXT = document.createElement("div");
    CARD_FOOD_DATA_TEXT.classList.add("cart_item_data_text");
    const H4 = document.createElement("h4");
    if (motive === "section") {
        H4.textContent = CURRENT_FOOD["name"];
    } else {
        H4.textContent = motive["name"];
    }
    const P = document.createElement("p");
    if (motive === "section") {
        P.textContent = CURRENT_FOOD["description"];
    } else {
        P.textContent = motive["description"];
    }
    [H4, P].forEach((elem) =>
        CARD_FOOD_DATA_TEXT.insertAdjacentElement("beforeend", elem)
    );
    const IMG = document.createElement("img");
    if (motive === "section") {
        IMG.src = CURRENT_FOOD["image"] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";
        IMG.alt = CURRENT_FOOD["name"] || "Producto";
    } else {
        IMG.src = motive["image"] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";
        IMG.alt = motive["name"] || "Producto";
    }
    [CARD_FOOD_DATA_TEXT, IMG].forEach((elem) =>
        CARD_FOOD_DATA.insertAdjacentElement("beforeend", elem)
    );
    const CARD_FOOD_FOOTER = document.createElement("div");
    CARD_FOOD_FOOTER.classList.add("cart_item_order", "flex", "j_sb");
    const PRICE = document.createElement("span");
    PRICE.classList.add("item_price");
    if (motive === "section") {
        const price = CURRENT_FOOD["price"] || "0";
        PRICE.textContent = `$ ${price} c/u`;
    } else {
        const price = motive["price"] || "$ 0";
        PRICE.textContent = price;
    }
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
        INPUT.value = motive["quantity"];
        INPUT.maxLength = "1";
        [SPAN_P, INPUT].forEach((elem) =>
            button_or_input.insertAdjacentElement("beforeend", elem)
        );
    }
    [PRICE, button_or_input].forEach((elem) =>
        CARD_FOOD_FOOTER.insertAdjacentElement("beforeend", elem)
    );
    [CARD_FOOD_DATA, CARD_FOOD_FOOTER].forEach((elem) =>
        CARD_FOOD.insertAdjacentElement("beforeend", elem)
    );
    return CARD_FOOD;
}

export function Update_Cart(CART_BODY) {
    if (localStorage.length > 0) {
        CART_BODY.textContent = "";
        for (let i = 0; i < localStorage.length; i++) {
            const STORAGED_ITEM = JSON.parse(localStorage[localStorage.key(i)]);
            const CARD_CART = create_card(STORAGED_ITEM);
            CART_BODY.insertAdjacentElement("beforeend", CARD_CART);
        }
        CART_BODY.nextElementSibling.classList.remove("hidden");
    }
}

export function Reset_Cart(CART_BODY) {
    localStorage.clear();
    const H3 = document.createElement("h3");
    H3.classList.add("all_c", "unselected");
    H3.textContent = "Carrito vacío. Carrito triste :(";
    CART_BODY.insertAdjacentElement("beforeend", H3);
    CART_BODY.nextElementSibling.classList.add("hidden");
}

export function Update_checkout() {
    if (localStorage.length > 0) {
        const SUBTOTAL = document.querySelector("#subtotal");
        SUBTOTAL.textContent = "";
        const TOTAL = document.querySelector("#total");
        TOTAL.textContent = "";
        const DETECT_NUMBERS_PATTERN = new RegExp(/[0-9]/, "gm");
        let contador = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const STORAGED_ITEM = JSON.parse(localStorage[localStorage.key(i)]);
            
            // Verificar que el precio existe y no es undefined
            if (STORAGED_ITEM["price"] && typeof STORAGED_ITEM["price"] === "string") {
                const priceMatch = STORAGED_ITEM["price"].match(DETECT_NUMBERS_PATTERN);
                if (priceMatch) {
                    contador +=
                        Number(priceMatch.join("")) * Number(STORAGED_ITEM["quantity"] || 1);
                }
            }
        }
        SUBTOTAL.insertAdjacentText("beforeend", `$ ${contador}`);
        TOTAL.insertAdjacentText("beforeend", `$ ${contador + 6000}`);
    }
}
