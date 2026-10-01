import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";


// ==============================
// Firebase設定
// ==============================

const firebaseConfig = {
    apiKey: "AIzaSyDs0l_AHLyppeX9s4yxqyti4K0CQMGAJJI",
    authDomain: "perezoso-order.firebaseapp.com",
    projectId: "perezoso-order",
    storageBucket: "perezoso-order.firebasestorage.app",
    messagingSenderId: "974299944359",
    appId: "1:974299944359:web:60d14422d88e078caf5282",
    measurementId: "G-35Z5VDT1RJ"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(
    app,
    "https://perezoso-order-default-rtdb.asia-southeast1.firebasedatabase.app"
);

// ==============================
// 卓番号をURLから取得
// ==============================

const params =
    new URLSearchParams(window.location.search);

const urlTableNumber =
    params.get("table");

if (urlTableNumber) {

    localStorage.setItem(
        "tableNumber",
        urlTableNumber
    );

}


// ==============================
// カートのデータを取得
// ==============================

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// ==============================
// HTMLの要素
// ==============================

const cartList =
    document.getElementById("cart-list");

const totalElement =
    document.getElementById("total");

const clearCartButton =
    document.getElementById("clear-cart-button");

const confirmModal =
    document.getElementById("confirm-modal");

const cancelClearButton =
    document.getElementById("cancel-clear");

const confirmClearButton =
    document.getElementById("confirm-clear");


// ==============================
// 注文確認画面
// ==============================

const orderButton =
    document.getElementById("order-button");

const orderModal =
    document.getElementById("order-modal");

const orderConfirmList =
    document.getElementById("order-confirm-list");

const orderConfirmTotal =
    document.getElementById("order-confirm-total");

const cancelOrderButton =
    document.getElementById("cancel-order");

const confirmOrderButton =
    document.getElementById("confirm-order");


// ==============================
// カートを保存
// ==============================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ==============================
// カートを表示
// ==============================

function displayCart() {

    cartList.innerHTML = "";

    let total = 0;


    // ==========================
    // カートが空の場合
    // ==========================

    if (cart.length === 0) {

        cartList.textContent =
            "カートに商品がありません。";

        totalElement.textContent =
            "合計 ¥0";

        return;

    }


    // ==========================
    // 商品を表示
    // ==========================

    cart.forEach(function(item, index) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        const subtotal =
            price * quantity;

        total += subtotal;


        // 商品の箱
        const itemElement =
            document.createElement("div");

        itemElement.className =
            "cart-item";


        itemElement.innerHTML =

            "<div>" +

                "<h3>" +
                    item.name +
                "</h3>" +

            "</div>" +


            "<div>" +

                "<button " +
                    "type='button' " +
                    "class='minus-button' " +
                    "data-index='" + index + "'>" +

                    "−" +

                "</button>" +

                "<span>" +
                    quantity +
                "</span>" +

                "<button " +
                    "type='button' " +
                    "class='plus-button' " +
                    "data-index='" + index + "'>" +

                    "＋" +

                "</button>" +

            "</div>" +


            "<p class='subtotal'>" +
                "小計 ¥" +
                subtotal.toLocaleString() +
            "</p>";


        cartList.appendChild(
            itemElement
        );

    });


    // ==========================
    // 合計金額
    // ==========================

    totalElement.textContent =
        "合計 ¥" +
        total.toLocaleString();


    // ==========================
    // −ボタン
    // ==========================

    document
        .querySelectorAll(".minus-button")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(button.dataset.index);


                    if (
                        cart[index] &&
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                        saveCart();

                        displayCart();

                    }

                }
            );

        });


    // ==========================
    // ＋ボタン
    // ==========================

    document
        .querySelectorAll(".plus-button")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(button.dataset.index);


                    if (cart[index]) {

                        cart[index].quantity++;

                        saveCart();

                        displayCart();

                    }

                }
            );

        });

}


// ==============================
// 「カートを空にする」
/* ============================== */

if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                return;

            }

            confirmModal.style.display =
                "flex";

        }
    );

}


// ==============================
// カート削除「キャンセル」
/* ============================== */

if (cancelClearButton) {

    cancelClearButton.addEventListener(
        "click",
        function() {

            confirmModal.style.display =
                "none";

        }
    );

}


// ==============================
// カート削除「削除する」
/* ============================== */

if (confirmClearButton) {

    confirmClearButton.addEventListener(
        "click",
        function() {

            cart = [];

            saveCart();

            confirmModal.style.display =
                "none";

            displayCart();

        }
    );

}


// ==============================
// 注文確認画面を表示
// ==============================

if (orderButton) {

    orderButton.addEventListener(
        "click",
        function() {

            // カートが空なら注文できない
            if (cart.length === 0) {

                alert(
                    "カートに商品がありません。"
                );

                return;

            }


            // 確認画面を一度空にする
            orderConfirmList.innerHTML = "";


            let total = 0;


            // ==========================
            // 注文内容を表示
            // ==========================

            cart.forEach(function(item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 1;

                const subtotal =
                    price * quantity;


                total += subtotal;


                const itemElement =
                    document.createElement("div");


                itemElement.className =
                    "order-confirm-item";


                itemElement.innerHTML =

                    "<div>" +

                        "<p>" +
                            item.name +
                        "</p>" +

                        "<p>" +
                            "¥" +
                            price.toLocaleString() +
                            " × " +
                            quantity +
                        "</p>" +

                    "</div>" +


                    "<strong>" +
                        "¥" +
                        subtotal.toLocaleString() +
                    "</strong>";


                orderConfirmList.appendChild(
                    itemElement
                );

            });


            // ==========================
            // 合計金額
            // ==========================

            orderConfirmTotal.textContent =
                "合計 ¥" +
                total.toLocaleString();


            // ==========================
            // 確認画面を表示
            // ==========================

            orderModal.style.display =
                "flex";

        }
    );

}


// ==============================
// 注文確認画面「戻る」
// ==============================

if (cancelOrderButton) {

    cancelOrderButton.addEventListener(
        "click",
        function() {

            orderModal.style.display =
                "none";

        }
    );

}


// ==============================
// 確認画面の外側を押して閉じる
// ==============================

if (orderModal) {

    orderModal.addEventListener(
        "click",
        function(event) {

            if (event.target === orderModal) {

                orderModal.style.display =
                    "none";

            }

        }
    );

}
// ==============================
// 「注文を確定する」
// ==============================

if (confirmOrderButton) {

    confirmOrderButton.addEventListener(
        "click",
        async function() {

            // カートが空なら終了
            if (cart.length === 0) {

                return;

            }


            // ==========================
            // 注文確認画面を閉じる
            // ==========================

            orderModal.style.display =
                "none";


            // ==========================
            // 卓番号を取得
            // ==========================

            const orderTableNumber =
                localStorage.getItem(
                    "tableNumber"
                ) || "不明";


            // ==========================
            // 注文番号を作成
            // ==========================

            const orderNumber =
                Date.now();


            // ==========================
            // 合計金額を計算
            // ==========================

            let orderTotal = 0;


            cart.forEach(function(item) {

                orderTotal +=
                    Number(item.price) *
                    Number(item.quantity);

            });


            // ==========================
            // 注文データを作成
            // ==========================

            const order = {

                orderNumber:
                    orderNumber,

                tableNumber:
                    orderTableNumber,

                items:
                    cart.map(function(item) {

                        return {
                            name: item.name,
                            price: Number(item.price),
                            quantity: Number(item.quantity)
                        };

                    }),

                total:
                    orderTotal,

                status:
                    "new",

                createdAt:
                    Date.now()

            };


            // ==========================
            // Firebaseに注文を保存
            // ==========================

            try {

    if (!db) {
        alert("Firebaseに接続できませんでした。");
        return;
    }

    const ordersRef =
        ref(db, "orders");

    const newOrderRef =
        push(ordersRef);

    await set(
        newOrderRef,
        order
    );

                // ==========================
                // ローカルにも保存
                // ==========================

                const orders =
                    JSON.parse(
                        localStorage.getItem(
                            "orders"
                        )
                    ) || [];


                orders.push(order);


                localStorage.setItem(
                    "orders",
                    JSON.stringify(orders)
                );


                // ==========================
                // カートを空にする
                // ==========================

                cart = [];

                saveCart();


                // ==========================
                // 注文完了画面
                // ==========================

                const completeModal =
                    document.getElementById(
                        "complete-modal"
                    );


                if (completeModal) {

                    completeModal.style.display =
                        "flex";

                }


                // ==========================
                // 注文番号を表示
                // ==========================

                const orderNumberElement =
                    document.getElementById(
                        "order-number"
                    );


                if (orderNumberElement) {

                    orderNumberElement.textContent =
                        "#" +
                        String(orderNumber).slice(-3);

                }


            } catch (error) {

                console.error(
                    "注文の保存に失敗しました",
                    error
                );


                alert(
                    "注文の送信に失敗しました。\nもう一度お試しください。"
                );

            }

        }
    );

}


// ==============================
// カートを最初に表示
// ==============================

displayCart();