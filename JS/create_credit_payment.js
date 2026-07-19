// ===========================
// expenses → credit_payments作成
// ===========================


console.log(
    "create_credit_payment.js 読込"
);



async function createCreditPayments(){


    console.log(
        "createCreditPayments開始"
    );



    // ===========================
    // クレジット利用取得
    // ===========================


    const { data: expenses, error } =

    await db

    .from("expenses")

    .select("*")

    .not(
        "credit_card_id",
        "is",
        null
    );




    console.log(
        "取得したexpenses",
        expenses
    );




    if(error){


        console.error(
            "expenses取得失敗",
            error
        );


        return;

    }






    if(
        !expenses ||
        expenses.length === 0
    ){

        console.log(
            "クレジット利用なし"
        );

        return;

    }







    // ===========================
    // 1件ずつ処理
    // ===========================


    for(
        const expense of expenses
    ){



        console.log(
            "処理対象",
            expense
        );





        // ===========================
        // 作成済み確認
        // ===========================


        const { data: exists, error: existsError } =

        await db

        .from("credit_payments")

        .select("id")

        .eq(
            "expense_id",
            expense.id
        );





        if(existsError){

            console.error(
                "重複確認失敗",
                existsError
            );

        }




        if(
            exists &&
            exists.length > 0
        ){

            console.log(
                "作成済み",
                expense.id
            );

            continue;

        }








        // ===========================
        // カード取得
        // ===========================


        const { data: card, error: cardError } =

        await db

        .from("credit_cards")

        .select("*")

        .eq(
            "id",
            expense.credit_card_id
        )

        .single();





        console.log(
            "カード情報",
            card
        );





        if(cardError){

            console.error(
                "カード取得失敗",
                cardError
            );

            continue;

        }








        // ===========================
        // 支払日計算
        // ===========================


        const expenseDate =
        new Date(
            expense.date
        );



        let year =
        expenseDate.getFullYear();



        let month =
        expenseDate.getMonth() + 2;





        if(month > 12){

            month = 1;

            year++;

        }






        const paymentDate =

        `${year}-` +

        String(month)
        .padStart(2,"0")

        +

        "-"

        +

        String(
            card.payment_day
        )
        .padStart(2,"0");






        console.log(
            "作成予定日",
            paymentDate
        );







        // ===========================
        // credit_payments作成
        // ===========================


        const { data:addData, error:addError } =

        await db

        .from("credit_payments")

        .insert({

            credit_card_id:
            expense.credit_card_id,


            expense_id:
            expense.id,


            payment_date:
            paymentDate,


            amount:
            expense.price,


            status:
            "未払い"

        })

        .select();






        console.log(
            "追加結果",
            addData
        );






        if(addError){


            console.error(
                "credit_payments追加失敗",
                addError
            );


            continue;

        }



    }



    console.log(
        "クレジット請求作成完了"
    );


}