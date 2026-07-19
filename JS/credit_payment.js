// ===========================
// クレジット引落処理
// ===========================


async function processCreditPayments(){



    const today =
    new Date()
    .toISOString()
    .split("T")[0];





    // ===========================
    // 未払い請求取得
    // ===========================


    const { data: payments, error } =

    await db

    .from("credit_payments")

    .select("*")

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
            "請求取得失敗",
            error
        );


        return;


    }







    for(const payment of payments){



        // ===========================
        // カード情報取得
        // ===========================


        const { data: card } =

        await db

        .from("credit_cards")

        .select("*")

        .eq(
            "id",
            payment.credit_card_id
        )

        .single();





        if(!card){

            continue;

        }







        // ===========================
        // 最新残高取得
        // ===========================


        const { data: history } =

        await db

        .from("balance_history")

        .select("*")

        .eq(
            "account_id",
            card.account_id
        )

        .order(
            "date",
            {
                ascending:false
            }
        )

        .limit(1)

        .single();







        if(!history){

            console.error(
                "残高履歴なし"
            );

            continue;

        }







        const newBalance =

        history.balance
        -
        payment.amount;







        // ===========================
        // 残高履歴追加
        // ===========================


        const { error:addError } =

        await db

        .from("balance_history")

        .insert({


            account_id:
            card.account_id,


            type:
            "引出",


            amount:
            payment.amount,


            memo:
            card.card_name
            +
            " 引落",


            date:
            payment.payment_date,


            balance:
            newBalance


        });






        if(addError){


            console.error(
                "残高登録失敗",
                addError
            );


            continue;


        }







        // ===========================
        // 支払済へ変更
        // ===========================


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





    }



}