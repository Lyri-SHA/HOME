// ===========================
// クレジット自動引落処理
// ===========================


async function processCreditPayments(){


    console.log(
        "クレジット引落チェック開始"
    );



    const today =

    new Date()
    .toISOString()
    .split("T")[0];





    // ===========================
    // 未払い取得
    // ===========================


    const { data:payments, error } =

    await db

    .from("credit_payments")

    .select(`

        id,

        amount,

        payment_date,

        credit_card_id,


        card:credit_card_id(

            account_id,

            card_name

        )

    `)

    .eq(
        "status",
        "未払い"
    )

    .lte(
        "payment_date",
        today
    );





    if(error){


        console.error(
            "支払取得失敗",
            error
        );


        return;


    }





    if(
        !payments ||
        payments.length === 0
    ){

        console.log(
            "引落対象なし"
        );

        return;

    }








    // ===========================
    // 1件ずつ処理
    // ===========================


    for(
        const payment of payments
    ){



        console.log(
            "引落処理",
            payment
        );





        const account_id =

        payment.card.account_id;





        // ===========================
        // balance_history追加
        // ===========================

        // ===========================
        // 口座残高更新
        // ===========================


        const { data:account, error:accountError } =

        await db

        .from("accounts")

        .select("balance")

        .eq(
            "id",
            account_id
        )

        .single();



        if(accountError){


            console.error(
                "口座取得失敗",
                accountError
            );


            continue;

        }




        const newBalance =

        account.balance - payment.amount;





        const { error:balanceError } =

        await db

        .from("accounts")

        .update({

            balance:
            newBalance

        })

        .eq(

            "id",

            account_id

        );





        if(balanceError){


            console.error(

                "残高更新失敗",

                balanceError

            );


            continue;


        }

        const { error:historyError } =

        await db

        .from("balance_history")

        .insert({


            account_id:


            account_id,


            type:

            "引落",


            amount:

            -payment.amount,


            memo:

            payment.card.card_name,


            date:

            payment.payment_date



        });






        if(historyError){


            console.error(

                "履歴追加失敗",

                historyError

            );


            continue;


        }








        // ===========================
        // 支払済変更
        // ===========================


        const { error:updateError } =

        await db

        .from("credit_payments")

        .update({


            status:

            "支払済"


        })

        .eq(

            "id",

            payment.id

        );






        if(updateError){


            console.error(

                "状態更新失敗",

                updateError

            );


        }


    }






    console.log(
        "クレジット引落処理完了"
    );


}