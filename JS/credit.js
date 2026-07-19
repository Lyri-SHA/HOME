// ===========================
// クレジット履歴表示
// ===========================


async function loadCreditHistory(){



    const { data, error } =

    await db

    .from("credit_payments")

    .select(`

        id,

        payment_date,

        amount,

        status,


        expense:expenses!credit_payments_expense_id_fkey(

            date,

            name,

            category

        ),


        card:credit_cards!credit_payments_credit_card_id_fkey(

            card_name

        )


    `)

    .order(

        "payment_date",

        {
            ascending:true
        }

    );





    if(error){


        console.error(
            error
        );


        document
        .getElementById("credit-list")
        .innerHTML =
        "取得失敗";


        return;


    }







    const area =

    document
    .getElementById("credit-list");





    if(
        !data ||
        data.length === 0
    ){


        area.innerHTML =

        "クレジット利用履歴はありません";


        return;


    }







    area.innerHTML = "";







    data.forEach(item => {



        const div =

        document.createElement("div");


        div.className =
        "credit-card";





        div.innerHTML = `


        <div>

        日付：
        ${item.expense.date}

        </div>


        <div>

        カード：
        ${item.card.card_name}

        </div>


        <div>

        内容：
        ${item.expense.name}

        </div>


        <div>

        金額：
        ${item.amount.toLocaleString()}円

        </div>


        <div>

        支払日：
        ${item.payment_date}

        </div>


        <div>

        状態：
        ${item.status}

        </div>


        `;



        area.appendChild(div);



    });



}






window.onload = () => {


    loadCreditHistory();


};