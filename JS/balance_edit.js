// ===========================
// 変数
// ===========================

let accountId = null;


// ===========================
// ページ読み込み
// ===========================

window.onload = function(){


    const params =
        new URLSearchParams(location.search);


    accountId =
       params.get("id");


    loadAccount();



    document
    .getElementById("type")
    .addEventListener(
        "change",
        changeType
    );


};




// ===========================
// 口座情報取得
// ===========================

async function loadAccount(){


    const { data, error } =
        await db
        .from("accounts")
        .select("*")
        .eq("id", accountId)
        .single();



    if(error){


        console.error(error);

        alert("口座情報取得失敗");

        return;

    }



    document
    .getElementById("account-name")
    .textContent =
        data.name + " 残高登録";


}





// ===========================
// 種類変更
// ===========================

function changeType(){


    const type =
        document
        .getElementById("type")
        .value;



    const area =
        document
        .getElementById("expense-area");



    if(type === "引き落とし"){


        area.style.display =
            "block";


    }
    else{


        area.style.display =
            "none";


    }


}





// ===========================
// 登録処理
// ===========================

async function saveBalance(){



    const type =
        document
        .getElementById("type")
        .value;



    const amount =
        Number(
            document
            .getElementById("amount")
            .value
        );



    const memo =
        document
        .getElementById("memo")
        .value;




    if(!amount || amount <= 0){


        alert("金額を入力してください");

        return;


    }





    // ===========================
    // 現在残高取得
    // ===========================


    const { data:account, error } =
        await db
        .from("accounts")
        .select("*")
        .eq("id", accountId)
        .single();



    if(error){


        console.error(error);

        alert("口座取得失敗");

        return;


    }





    let newBalance =
        account.balance;




    // ===========================
    // 残高計算
    // ===========================


    if(type === "預入"){


        newBalance += amount;


    }
    else{


        newBalance -= amount;


    }





    console.log("現在残高");
    console.log(account.balance);


    console.log("更新後残高");
    console.log(newBalance);







    // ===========================
    // accounts更新
    // ===========================


    const {
        data:updateData,
        error:updateError
    } =

        await db
        .from("accounts")
        .update({

            balance:newBalance

        })
        .eq(
            "id",
            accountId
        )
        .select();



    console.log("更新後データ");
    console.log(updateData);


    console.log("更新エラー");
    console.log(updateError);




    if(updateError){


        console.error(updateError);

        alert("残高更新失敗");

        return;


    }







    // ===========================
    // 残高履歴保存
    // ===========================


    const {
        data:historyData,
        error:historyError

    } =

        await db
        .from("balance_history")
        .insert({

            account_id:
                accountId,


            type:
                type,


            amount:
                amount,


            memo:
                memo,


            date:
                new Date()
                .toISOString()
                .split("T")[0]

        })
        .select();




    console.log("履歴保存");
    console.log(historyData);


    console.log("履歴エラー");
    console.log(historyError);




    if(historyError){


        alert("履歴保存失敗");

        return;


    }








    // ===========================
    // 引き落としの場合
    // expensesへ登録
    // ===========================


    if(type === "引き落とし"){



        const category =
            document
            .getElementById("category")
            .value;



        const name =
            document
            .getElementById("name")
            .value;





        const {
            data:expenseData,
            error:expenseError

        } =

            await db
            .from("expenses")
            .insert({

                date:
                new Date()
                .toISOString()
                .split("T")[0],


                category:
                category,


                name:
                name,


                price:
                amount,


                memo:
                memo

            })
            .select();





        console.log("家計簿登録");
        console.log(expenseData);


        console.log("家計簿エラー");
        console.log(expenseError);




        if(expenseError){


            alert("家計簿登録失敗");

            return;


        }


    }






    alert("登録しました");







    // ===========================
    // 入力リセット
    // ===========================


    document
    .getElementById("amount")
    .value = "";



    document
    .getElementById("memo")
    .value = "";



    document
    .getElementById("category")
    .value = "";



    document
    .getElementById("name")
    .value = "";



}