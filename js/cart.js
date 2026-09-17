// カートのデータを取得
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cart-list");
const totalElement = document.getElementById("total");


// カートを保存
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// カートを表示
function displayCart() {

    cartList.innerHTML = "";

    let total = 0;


    // カートが空の場合
    if (cart.length === 0) {

        cartList.textContent = "カートに商品がありません。";

        totalElement.textContent = "合計 ¥0";

        return;
    }


    // 商品を表示
    cart.forEach(function(item, index) {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        const subtotal = price * quantity;

        total += subtotal;


        // 商品1個分の箱
        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";


        itemElement.innerHTML =
            "<div>" +
                "<h3>" + item.name + "</h3>" +
                "<p>¥" + price.toLocaleString() + "</p>" +
            "</div>" +

            "<div>" +
                "<button type='button' class='minus-button' data-index='" + index + "'>−</button>" +
                "<span>" + quantity + "</span>" +
                "<button type='button' class='plus-button' data-index='" + index + "'>＋</button>" +
            "</div>" +

            "<p>¥" + subtotal.toLocaleString() + "</p>";


        cartList.appendChild(itemElement);

    });


    // 合計金額
    totalElement.textContent =
        "合計 ¥" + total.toLocaleString();


    // −ボタン
    document.querySelectorAll(".minus-button").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            if (cart[index].quantity > 1) {

                cart[index].quantity--;

                saveCart();

                displayCart();

            }

        });

    });


    // ＋ボタン
    document.querySelectorAll(".plus-button").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            cart[index].quantity++;

            saveCart();

            displayCart();

        });

    });

}


// 「カートを空にする」
document.getElementById("clear-cart-button").addEventListener("click", function() {

    if (cart.length === 0) {
        return;
    }

    document.getElementById("confirm-modal").style.display = "flex";

});


// 「キャンセル」
document.getElementById("cancel-clear").addEventListener("click", function() {

    document.getElementById("confirm-modal").style.display = "none";

});


// 「削除する」
document.getElementById("confirm-clear").addEventListener("click", function() {

    cart = [];

    saveCart();

    document.getElementById("confirm-modal").style.display = "none";

    displayCart();

});


// 最初にカートを表示
displayCart();