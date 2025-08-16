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
        try {
            console.log(`Fetching data for store: ${current_store}`);
            const response = await fetch("./foods.json");
            const data = await response.json();
            return data[current_store];
        } catch (error) {
            console.error("Error loading foods.json:", error);
            return [];
        }
    }

    function current_page() {
        const pathname = document.location.pathname;
        const filename = pathname.split("/").pop();
        const pageName = filename.split(".").reverse().pop();
        console.log("Path detection:", { pathname, filename, pageName });
        return pageName;
    }

    const CURRENT_PAGE = current_page();
    console.log("Current page detected:", CURRENT_PAGE);

    if (CURRENT_PAGE !== "index" && CURRENT_PAGE !== "") {
        console.log("Loading data for page:", CURRENT_PAGE);
        FOOD_JSON = await fetch_json(CURRENT_PAGE);
        console.log("Loaded FOOD_JSON:", FOOD_JSON);
        
        if (FOOD_JSON && FOOD_JSON.length > 0) {
            TYPES_OF_FOOD.length = 0; // Clear array
            FOOD_JSON.forEach((food) => {
                if (!TYPES_OF_FOOD.includes(food["type"])) {
                    TYPES_OF_FOOD.push(food["type"]);
                }
            });
            console.log("Food types extracted:", TYPES_OF_FOOD);
        }
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
    console.log("🚀 DOM loaded, starting initialization");
    
    // Clean localStorage thoroughly
    localStorage.removeItem("current_page");
    localStorage.removeItem("current-page");
    localStorage.removeItem("content");
    localStorage.removeItem("description");
    localStorage.removeItem("title");
    
    // Also clean any corrupted cart items
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('to_cart_')) {
            try {
                JSON.parse(localStorage.getItem(key));
            } catch (e) {
                console.log(`🗑️ Removing corrupted item: ${key}`);
                localStorage.removeItem(key);
            }
        }
    });

    // Import modules with error handling
    let dynamicAdjusts, filtersSettings;
    try {
        dynamicAdjusts = await import("./dinamic_adjusts.js");
        filtersSettings = await import("./filters_settings.js");
        console.log("✅ Modules imported successfully");
    } catch (error) {
        console.error("❌ Error importing modules:", error);
        return;
    }

    const {
        close_menu,
        adjustPadding,
        initializeDynamicContent,
        Update_Cart,
        Reset_Cart,
        Update_checkout,
    } = dynamicAdjusts;
    
    const { apply_filters, get_filters_settings, initializeFilters } = filtersSettings;

    async function initialize_Values_Events() {
        document.querySelectorAll(".value").forEach((value) => {
            value.addEventListener("input", (e) => {
                const PARENT_ELEM = value.parentElement.parentElement.parentElement;
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
                const PARENT_ELEM = value.parentElement.parentElement.parentElement;
                const localStorage_KEY_CURRENT_ELEMENT = `to_cart_${UndersoreString(
                    PARENT_ELEM.querySelector("h4").textContent
                )}`;
                if (value.value === "") {
                    value.value = "1";
                    Update_Quantity_localStorage("1", localStorage_KEY_CURRENT_ELEMENT);
                    Update_checkout();
                } else if (value.value === "0") {
                    localStorage.removeItem(`to_cart_${UndersoreString(
                        PARENT_ELEM.querySelector("h4").textContent
                    )}`);
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

    function addPickItemEventListeners() {
        console.log("🔗 Adding pick item event listeners");
        
        document.querySelectorAll(".pick_item").forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("🛒 Pick item clicked");
                
                const SELECTED_ITEM = {
                    name: undefined,
                    description: undefined,
                    price: undefined,
                    image: undefined,
                    quantity: "1",
                };
                
                const PARENT_ELEM = button.closest('.card');
                if (!PARENT_ELEM) {
                    console.error("Could not find parent card element");
                    return;
                }
                
                const nameElement = PARENT_ELEM.querySelector("h4");
                const descElement = PARENT_ELEM.querySelector("p");
                const priceElement = PARENT_ELEM.querySelector("span");
                const imageElement = PARENT_ELEM.querySelector("img");
                
                if (!nameElement || !priceElement) {
                    console.error("Could not find required elements in card");
                    return;
                }
                
                SELECTED_ITEM["name"] = nameElement.textContent || "Producto sin nombre";
                SELECTED_ITEM["description"] = descElement ? descElement.textContent : "";
                SELECTED_ITEM["price"] = priceElement.textContent || "$ 0 c/u";
                SELECTED_ITEM["image"] = imageElement && imageElement.src !== "undefined" ? imageElement.src : "";
                
                console.log("🛒 Item data:", SELECTED_ITEM);
                
                localStorage.setItem(
                    `to_cart_${UndersoreString(nameElement.textContent)}`,
                    JSON.stringify(SELECTED_ITEM)
                );
                
                Update_Cart(CART_BODY);
                Update_checkout();
                initialize_Values_Events();
                
                console.log(`✅ Added "${SELECTED_ITEM.name}" to cart`);
            });
        });
        
        console.log(`✅ Added listeners to ${document.querySelectorAll(".pick_item").length} buttons`);
    }

    // Setup basic event listeners
    document.querySelectorAll(".exit_aside").forEach((button) => 
        button.addEventListener("click", close_menu)
    );

    window.addEventListener("scroll", function () {
        const header = document.querySelector("header");
        const scrollTop = window.scrollY;
        header.style.top = "0";
    });

    adjustPadding();

    // Initialize data
    const CURRENT_PAGE = await initializeData();
    console.log("📊 Data initialization complete for:", CURRENT_PAGE);

    // Update cart and events
    Update_Cart(CART_BODY);
    Update_checkout();
    await initialize_Values_Events();

    // Restaurant page specific initialization
    if (CURRENT_PAGE !== "index" && CURRENT_PAGE !== "") {
        console.log("🏪 Initializing restaurant page for:", CURRENT_PAGE);
        
        try {
            // Initialize filters
            await initializeFilters();
            console.log("✅ Filters initialized");
            
            // Initialize dynamic content
            await initializeDynamicContent();
            console.log("✅ Dynamic content initialized");
            
            // Add event listeners to buttons
            setTimeout(() => {
                addPickItemEventListeners();
            }, 100);

            // Setup filter functionality
            const filterButton = document.querySelector("#button_filter");
            const clearButton = document.querySelector("#button_clear");
            
            if (filterButton) {
                filterButton.addEventListener("click", () => {
                    console.log("🔍 Filter button clicked");
                    try {
                        const [FILTER_INPUT, FILTER_OPTIONS, RESULTS_SECTION, SECTIONS] = get_filters_settings();
                        let options = [];
                        FILTER_OPTIONS.forEach((option) =>
                            option.checked ? options.push(option) : null
                        );
                        RESULTS_SECTION.classList.remove("no_display");
                        SECTIONS.forEach((section) => section.classList.add("no_display"));
                        apply_filters(FILTER_INPUT, options, RESULTS_SECTION);
                    } catch (error) {
                        console.error("Error applying filters:", error);
                    }
                });
            }

            if (clearButton) {
                clearButton.addEventListener("click", () => {
                    console.log("🧹 Clear button clicked");
                    try {
                        const [FILTER_INPUT, FILTER_OPTIONS, RESULTS_SECTION, SECTIONS] = get_filters_settings();
                        FILTER_INPUT.value = "";
                        FILTER_OPTIONS.forEach((option) => (option.checked = false));
                        SECTIONS.forEach((section) => section.classList.remove("no_display"));
                        
                        const gridShop = RESULTS_SECTION.querySelector(".grid_shop");
                        if (gridShop) {
                            gridShop.childNodes.forEach((product) => {
                                if (product.nodeName !== "#text" && product.nodeName !== "H3") {
                                    product.classList.add("no_display");
                                }
                            });
                        }
                        RESULTS_SECTION.classList.add("no_display");
                    } catch (error) {
                        console.error("Error clearing filters:", error);
                    }
                });
            }
            
            console.log("✅ Restaurant page initialization complete");
        } catch (error) {
            console.error("❌ Error during restaurant page initialization:", error);
        }
    }
    
    console.log("🎉 Full initialization complete");
});
