import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    update
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
// 最新の注文データを保存
// ==============================

let currentOrders = {};


// ==============================
// 注文を取得
// ==============================

const ordersRef = ref(db, "orders");

onValue(ordersRef, function(snapshot) {

    const ordersData = snapshot.val();

    currentOrders = ordersData || {};

    displayOrders();

    displayCheckoutRequests();

});


// ==============================
// 注文を表示する
// ==============================

function displayOrders() {

    const ordersArea =
        document.getElementById("orders");

    if (!ordersArea) {
        return;
    }


    if (!currentOrders ||
        Object.keys(currentOrders).length === 0) {

        ordersArea.innerHTML = `
            <p class="no-order">
                現在、注文はありません。
            </p>
        `;

        return;
    }


    // 注文を配列にする

    const orders =
        Object.entries(currentOrders).map(
            function([id, order]) {

                return {
                    id: id,
                    ...order
                };

            }
        );


    // 古い注文を上にする

    orders.sort(function(a, b) {

        return Number(a.createdAt || 0) -
               Number(b.createdAt || 0);

    });


    ordersArea.innerHTML = "";


    // ==============================
    // 注文を1件ずつ表示
    // ==============================

    orders.forEach(function(order) {

        // 提供済みの注文は表示しない

        if (order.status === "completed") {
            return;
        }


        const orderCard =
            document.createElement("div");


        // ==============================
        // 商品一覧
        // ==============================

        let itemsHTML = "";


        if (order.items) {

            Object.values(order.items).forEach(
                function(item) {

                    itemsHTML += `
                        <div class="order-item">

                            <span>
                                ${item.name} × ${item.quantity}
                            </span>

                            <span>
                                ¥${(
                                    Number(item.price) *
                                    Number(item.quantity)
                                ).toLocaleString()}
                            </span>

                        </div>
                    `;

                }
            );

        }


        // ==============================
        // ステータス
        // ==============================

        const status =
            order.status || "new";


        let statusText = "";
        let buttonHTML = "";


        if (status === "new") {

            statusText = "新しい注文";


            buttonHTML = `
                <button
                    type="button"
                    class="status-button"
                    data-order-id="${order.id}"
                    data-next-status="cooking"
                    style="
                        margin-top:15px;
                        padding:12px 20px;
                        border:none;
                        border-radius:8px;
                        background:#9e0000;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    調理開始
                </button>
            `;


        } else if (status === "cooking") {

            statusText = "調理中";


            buttonHTML = `
                <button
                    type="button"
                    class="status-button"
                    data-order-id="${order.id}"
                    data-next-status="completed"
                    style="
                        margin-top:15px;
                        padding:12px 20px;
                        border:none;
                        border-radius:8px;
                        background:#555;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    提供済みにする
                </button>
            `;


        } else {

            statusText = status;

        }


        // ==============================
        // 注文カード
        // ==============================

        orderCard.innerHTML = `

            <h2>
                テーブル ${order.tableNumber || "不明"}
            </h2>

            <div class="order-info">

                <strong>注文番号：</strong>

                #${String(
                    order.orderNumber || ""
                ).slice(-3)}

            </div>


            <div class="order-info">

                <span class="status">
                    ${statusText}
                </span>

            </div>


            <div>
                ${itemsHTML}
            </div>


            <p class="total">

                合計 ¥${Number(
                    order.total || 0
                ).toLocaleString()}

            </p>


            ${buttonHTML}

        `;


        ordersArea.appendChild(orderCard);

    });


    // ==============================
    // ステータス変更ボタン
    // ==============================

    const buttons =
        document.querySelectorAll(
            ".status-button"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            async function() {

                const orderId =
                    button.dataset.orderId;

                const nextStatus =
                    button.dataset.nextStatus;


                try {

                    const orderRef =
                        ref(
                            db,
                            "orders/" + orderId
                        );


                    await update(
                        orderRef,
                        {
                            status: nextStatus
                        }
                    );


                } catch (error) {

                    console.error(
                        "注文ステータス変更エラー:",
                        error
                    );


                    alert(
                        "注文状態の変更に失敗しました。"
                    );

                }

            }
        );

    });

}


// ==============================
// 会計依頼を取得
// ==============================

const checkoutRequestsRef =
    ref(db, "checkoutRequests");


onValue(
    checkoutRequestsRef,
    function(snapshot) {

        const checkoutData =
            snapshot.val();

        displayCheckoutRequests(
            checkoutData
        );

    }
);


// ==============================
// 会計依頼を表示
// ==============================

function displayCheckoutRequests(
    checkoutData
) {

    const checkoutList =
        document.getElementById(
            "checkout-list"
        );


    if (!checkoutList) {
        return;
    }


    checkoutList.innerHTML = "";


    if (!checkoutData) {

        checkoutList.innerHTML = `
            <p class="no-checkout">
                会計依頼はありません。
            </p>
        `;

        return;

    }


    // ==============================
    // 「requested」の会計だけ取得
    // ==============================

    const requests =
        Object.entries(checkoutData)
            .map(function([id, request]) {

                return {
                    id: id,
                    ...request
                };

            })
            .filter(function(request) {

                return request.status === "requested";

            });


    if (requests.length === 0) {

        checkoutList.innerHTML = `
            <p class="no-checkout">
                会計依頼はありません。
            </p>
        `;

        return;

    }


    // ==============================
    // 新しい会計依頼を上にする
    // ==============================

    requests.sort(function(a, b) {

        return Number(b.createdAt || 0) -
               Number(a.createdAt || 0);

    });


    // ==============================
    // 会計依頼を表示
    // ==============================

    requests.forEach(function(request) {

        const tableNumber =
            request.tableNumber || "不明";


        // ==============================
        // そのテーブルの合計金額
        // ==============================

        let totalAmount = 0;


        Object.values(currentOrders).forEach(
            function(order) {

                if (
                    String(order.tableNumber) ===
                    String(tableNumber)
                ) {

                    totalAmount +=
                        Number(order.total || 0);

                }

            }
        );


        // ==============================
        // 会計カード
        // ==============================

        const checkoutCard =
            document.createElement("div");


        checkoutCard.className =
            "checkout-card";


        checkoutCard.innerHTML = `

            <h3>
                テーブル ${tableNumber}
            </h3>


            <p class="checkout-total">
                合計
                ¥${totalAmount.toLocaleString()}
            </p>


            <button
type="button"

                class="checkout-complete-button"

                data-checkout-id="${request.id}"

            >

                会計済みにする

            </button>

        `;

        checkoutList.appendChild(

            checkoutCard

        );

    });

    // ==============================

    // 会計済みボタン

    // ==============================

    const checkoutButtons =

        document.querySelectorAll(

            ".checkout-complete-button"

        );

    checkoutButtons.forEach(

        function(button) {

            button.addEventListener(

                "click",

                async function() {

                    const checkoutId =

                        button.dataset.checkoutId;

                    try {

                        const checkoutRef =

                            ref(

                                db,

                                "checkoutRequests/" +

                                checkoutId

                            );

                        await update(

                            checkoutRef,

                            {

                                status: "completed"

                            }

                        );

                    } catch (error) {

                        console.error(

                            "会計ステータス変更エラー:",

                            error

                        );

                        alert(

                            "会計済みへの変更に失敗しました。"

                        );

                    }

                }

            );

        }

    );

}