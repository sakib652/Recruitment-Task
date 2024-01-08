document.addEventListener("DOMContentLoaded", function () {
    const foodItemsContainer = document.getElementById("food-items");
    const cartContainer = document.getElementById("cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSidebar = document.getElementById("cart-sidebar");
    const sidebarToggle1 = document.getElementById("sidebarToggle1");
    const sidebarToggle2 = document.getElementById("sidebarToggle2");
    const sidebarToggle3 = document.getElementById("sidebarToggle3");
    let totalPrice = 0;

    foodItemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart-btn") && !event.target.classList.contains("added-to-cart")) {
            addToCart(event.target.closest(".food-item"));
            cartSidebar.classList.add("show-sidebar");
        }
    });

    function addToCart(foodItem) {
        const itemId = foodItem.dataset.id;
        const itemName = foodItem.dataset.name;
        const itemPrice = parseFloat(foodItem.dataset.price);
        const itemImage = foodItem.querySelector('img').src;

        const existingCartItem = document.querySelector(`#cart [data-id="${itemId}"]`);

        if (existingCartItem) {
            const quantityElement = existingCartItem.querySelector(".item-quantity");
            const quantity = parseInt(quantityElement.textContent) + 1;
            quantityElement.textContent = quantity;
            updateCartItemPrice(existingCartItem, quantity, itemPrice);
        } else {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.dataset.id = itemId;

            cartItem.innerHTML = `
                <img src="${itemImage}" alt="${itemName}">
                <span>${itemName}</span>
                <div class="quantity-container">
                    <button class="quantity-btn" data-delta="-1">-</button>
                    <span class="item-quantity">1</span>
                    <button class="quantity-btn" data-delta="1">+</button>
                </div>
                <span class="item-price">$${itemPrice.toFixed(2)}</span>
                <span class="remove-item-btn" onclick="removeCartItem(this)">
                    <i class="fas fa-trash-alt"></i>
                </span>
            `;

            const quantityButtons = cartItem.querySelectorAll(".quantity-btn");
            quantityButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const delta = parseInt(button.dataset.delta);
                    changeQuantity(button, delta, itemPrice);
                });
            });

            cartItemsContainer.appendChild(cartItem);
        }

        updateTotalPrice();
        cartContainer.classList.remove("hidden");

        const addToCartButton = foodItem.querySelector(".add-to-cart-btn");
        addToCartButton.classList.add("added-to-cart");
        addToCartButton.disabled = true;
        addToCartButton.style.backgroundColor = "gray";
    }

    function changeQuantity(button, delta, itemPrice) {
        const quantityElement = button.parentNode.querySelector(".item-quantity");
        let quantity = parseInt(quantityElement.textContent) + delta;
        if (quantity < 1) {
            quantity = 1;
        }
        quantityElement.textContent = quantity;

        const cartItem = button.closest(".cart-item");
        if (cartItem) {
            updateCartItemPrice(cartItem, quantity, itemPrice);
        }

        updateTotalPrice();
    }

    function removeCartItem(button) {
        const cartItem = button.closest(".cart-item");
        const itemPrice = parseFloat(cartItem.querySelector(".item-price").textContent.substr(1));
        const quantity = parseInt(cartItem.querySelector(".item-quantity").textContent);
    
        totalPrice -= itemPrice * quantity;
    
        cartItem.remove();
    
        if (cartItemsContainer.childElementCount === 0) {
            cartContainer.classList.add("hidden");
        }
    
        updateTotalPrice();
    
        const itemId = cartItem.dataset.id;
        const addToCartButton = document.querySelector(`#food-items [data-id="${itemId}"] .add-to-cart-btn`);
        addToCartButton.classList.remove("added-to-cart");
        addToCartButton.disabled = false;
        addToCartButton.style.backgroundColor = "";
    
        event.stopPropagation();
    }
    
    cartItemsContainer.addEventListener("click", function (event) {
        const clickedElement = event.target;
    
        if (clickedElement.classList.contains("remove-item-btn") || clickedElement.closest(".remove-item-btn")) {
            removeCartItem(clickedElement);
        }
    });
    
    function updateTotalPrice() {
        totalPrice = 0;
        const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
        cartItems.forEach(function (cartItem) {
            const itemPrice = parseFloat(cartItem.querySelector(".item-price").textContent.substr(1));
            const quantity = parseInt(cartItem.querySelector(".item-quantity").textContent);
            totalPrice += itemPrice * quantity;
        });

        const totalElement = cartContainer.querySelector(".total-price");
        if (totalElement) {
            totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        } else {
            const newTotalElement = document.createElement("p");
            newTotalElement.classList.add("total-price");
            newTotalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
            cartContainer.appendChild(newTotalElement);
        }

        if (cartItems.length === 0) {
            cartContainer.classList.add("hidden");
        }
    }

    cartItemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-item-btn")) {
            removeCartItem(event.target);
        }
    });

    document.addEventListener("click", function (event) {
        const clickedElement = event.target;

        if (!cartSidebar.contains(clickedElement) && !isSidebarToggleClicked(event)) {
            if (cartSidebar.classList.contains("show-sidebar")) {
                cartSidebar.classList.remove("show-sidebar");
            }
        }
    });

    function isSidebarToggleClicked(event) {
        return (
            event.target === sidebarToggle1 ||
            event.target === sidebarToggle2 ||
            event.target === sidebarToggle3
        );
    }
});

function updateCartItemPrice(cartItem, quantity, itemPrice) {
    const priceElement = cartItem.querySelector(".item-price");
    const updatedPrice = quantity * itemPrice;
    priceElement.textContent = `$${updatedPrice.toFixed(2)}`;
}
