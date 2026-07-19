// ===========================
// クレジットカード取得
// ===========================

async function loadCreditCards(){


    const select =
    document.getElementById(
        "credit_card_id"
    );


    if(!select){

        return;

    }



    const { data, error } =

    await db

    .from("credit_cards")

    .select("*")

    .eq(
        "enabled",
        true
    );



    if(error){

        console.error(
            "カード取得失敗",
            error
        );

        return;

    }



    data.forEach(card=>{


        const option =
        document.createElement(
            "option"
        );


        option.value =
        card.id;


        option.textContent =
        card.card_name;


        select.appendChild(
            option
        );


    });


}







async function addExpense(){



    const expense = {


        date:
        document.getElementById(
            "date"
        ).value,



        category:
        document.getElementById(
            "category"
        ).value,



        name:
        document.getElementById(
            "name"
        ).value,



        price:
        Number(
        document.getElementById(
            "price"
        ).value),



        memo:
        document.getElementById(
            "memo"
        ).value,



        credit_card_id:
        document.getElementById(
            "credit_card_id"
        ).value || null


    };







    // ===========================
    // expenses登録
    // ===========================


    const { data:newExpense, error } =

    await db

    .from("expenses")

    .insert(expense)

    .select()

    .single();





    if(error){


        console.error(error);


        alert(
            "登録失敗"
        );


        return;


    }







    // ===========================
    // クレジット請求作成
    // ===========================


    if(
        expense.credit_card_id
    ){



        const { data:card, error:cardError } =

        await db

        .from("credit_cards")

        .select("*")

        .eq(
            "id",
            expense.credit_card_id
        )

        .single();





        if(cardError){


            console.error(
                "カード取得失敗",
                cardError
            );


        }
        else{


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

            `${year}-`

            +

            String(month)
            .padStart(2,"0")

            +

            "-"

            +

            String(
                card.payment_day
            )
            .padStart(2,"0");







            const { error:paymentError } =

            await db

            .from("credit_payments")

            .insert({


                credit_card_id:
                expense.credit_card_id,


                expense_id:
                newExpense.id,


                payment_date:
                paymentDate,


                amount:
                expense.price,


                status:
                "未払い"


            });







            if(paymentError){


                console.error(
                    "credit_payments作成失敗",
                    paymentError
                );


            }


        }



    }









    // ===========================
    // LINE通知
    // ===========================



    const lineResult =

    await fetch(

    "https://yjwtjtjfshibgqgjgfkv.supabase.co/functions/v1/notify-line",

    {


        method:"POST",


        headers:{


            "Content-Type":
            "application/json"


        },


        body:JSON.stringify({


            name:
            expense.name,


            category:
            expense.category,


            price:
            expense.price


        })


    });







    if(!lineResult.ok){


        console.error(

            "LINE通知失敗",

            await lineResult.text()

        );


    }






    const lineText =

    await lineResult.text();



    console.log(

        "LINE結果",

        lineText

    );







    alert(
        "登録成功"
    );







    // ===========================
    // 入力リセット
    // ===========================


    document.getElementById(
        "date"
    ).value = "";



    document.getElementById(
        "category"
    ).value = "";



    document.getElementById(
        "name"
    ).value = "";



    document.getElementById(
        "price"
    ).value = "";



    document.getElementById(
        "credit_card_id"
    ).value = "";



    document.getElementById(
        "memo"
    ).value = "";



}







// ===========================
// ページ読み込み時
// ===========================


window.onload = function(){


    loadCreditCards();


};