// ==============================
// カートを取得
// ==============================
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


// ==============================
// カートを保存
// ==============================
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ==============================
// HTMLの要素
// ==============================
const modal = document.getElementById("modal");
const modalName = document.getElementById("modal-name");
const quantityText = document.getElementById("quantity");

const minusButton = document.getElementById("minus");
const plusButton = document.getElementById("plus");

const addCartButton = document.getElementById("add-cart");
const closeButton = document.getElementById("close-modal");

const cartCount = document.getElementById("cart-count");


// ==============================
// 選択中の商品
// ==============================
let selectedName = "";
let selectedPrice = 0;
let quantity = 1;


// ==============================
// カートの数字を更新
// ==============================
function updateCartCount() {

    if (!cartCount) {
        return;
    }

    const cart = getCart();

    let count = 0;

    cart.forEach(function(item) {
        count += Number(item.quantity) || 0;
    });

    cartCount.textContent = count;

    if (count > 0) {
        cartCount.style.display = "flex";
    } else {
        cartCount.style.display = "none";
    }
}


// ==============================
// 商品の＋ボタン
// ==============================
document.querySelectorAll(".add-button").forEach(function(button) {

    button.addEventListener("click", function() {

        selectedName = button.dataset.name;
        selectedPrice = Number(button.dataset.price);

        quantity = 1;

        modalName.textContent = selectedName;
        quantityText.textContent = quantity;

        modal.style.display = "flex";

    });

});


// ==============================
// 数量＋
// ==============================
if (plusButton) {

    plusButton.addEventListener("click", function() {

        quantity++;

        quantityText.textContent = quantity;

    });

}


// ==============================
// 数量−
// ==============================
if (minusButton) {

    minusButton.addEventListener("click", function() {

        if (quantity > 1) {

            quantity--;

            quantityText.textContent = quantity;

        }

    });

}


// ==============================
// カートに入れる
// ==============================
if (addCartButton) {

    addCartButton.addEventListener("click", function() {

        const cart = getCart();

        const existingItem = cart.find(function(item) {
            return item.name === selectedName;
        });


        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            cart.push({
                name: selectedName,
                price: selectedPrice,
                quantity: quantity
            });

        }


        saveCart(cart);

        updateCartCount();

        modal.style.display = "none";

    });

}


// ==============================
// 閉じる
// ==============================
if (closeButton) {

    closeButton.addEventListener("click", function() {

        modal.style.display = "none";

    });

}


// ==============================
// 背景を押して閉じる
// ==============================
if (modal) {

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {

            modal.style.display = "none";

        }

    });

}


// ==============================
// メニューを開いた時に
// カートの数字を読み込む
// ==============================
updateCartCount();