import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";


// ==============================
// Firebase
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
// HTMLの要素
// ==============================

const checkoutButton =
    document.getElementById("checkout-button");

const checkoutModal =
    document.getElementById("checkout-confirm-modal");

const cancelButton =
    document.getElementById("checkout-cancel");

const confirmButton =
    document.getElementById("checkout-confirm");

const successModal =
    document.getElementById("checkout-success-modal");

const okButton =
    document.getElementById("checkout-ok");


// ==============================
// 会計ボタンを無効化
// ==============================

function disableCheckoutButton() {

    if (!checkoutButton) {
        return;
    }

    checkoutButton.style.opacity = "0.5";
    checkoutButton.style.pointerEvents = "none";

}


// ==============================
// 会計ボタンを押したとき
// ==============================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            // 会計確認画面を表示
            checkoutModal.style.display = "flex";

        }
    );

}


// ==============================
// キャンセル
// ==============================

if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        function() {

            checkoutModal.style.display = "none";

        }
    );

}


// ==============================
// 「会計する」を押したとき
// ==============================

if (confirmButton) {

    confirmButton.addEventListener(
        "click",
        async function() {

            // 会計確認画面を閉じる
            checkoutModal.style.display = "none";


            // ==============================
            // URLから席番号を取得
            // ==============================

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const tableNumber =
                params.get("table");


            if (!tableNumber) {

                alert("席番号が確認できません。");

                return;

            }


            try {

                // ==============================
                // 会計依頼を取得
                // ==============================

                const checkoutRef =
                    ref(db, "checkoutRequests");

                const snapshot =
                    await get(checkoutRef);

                const checkoutData =
                    snapshot.val();


                // ==============================
                // すでに会計依頼済みか確認
                // ==============================

                let alreadyRequested = false;


                if (checkoutData) {

                    Object.values(checkoutData).forEach(
                        function(request) {

                            if (
                                String(request.tableNumber) ===
                                String(tableNumber) &&
                                request.status === "requested"
                            ) {

                                alreadyRequested = true;

                            }

                        }
                    );

                }


                // ==============================
                // すでに依頼済みなら
                // ==============================

                if (alreadyRequested) {

                    disableCheckoutButton();

                    return;

                }


                // ==============================
                // 新しい会計依頼を作成
                // ==============================

                const newCheckoutRef =
                    push(checkoutRef);


                await set(
                    newCheckoutRef,
                    {
                        tableNumber: tableNumber,
                        status: "requested",
                        createdAt: Date.now()
                    }
                );


                // ==============================
                // 「ありがとうございました」を表示
                // ==============================

                successModal.style.display = "flex";


                // ==============================
                // 会計ボタンを押せなくする
                // ==============================

                disableCheckoutButton();


            } catch (error) {

                console.error(error);

                alert(
                    "会計依頼の送信に失敗しました。"
                );

            }

        }
    );

}


// ==============================
// 「OK」を押したとき
// ==============================

if (okButton) {

    okButton.addEventListener(
        "click",
        function() {

            successModal.style.display = "none";

        }
    );

}