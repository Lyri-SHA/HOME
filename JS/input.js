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
    .eq("enabled", true);



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
        document.getElementById("date").value,



        category:
        document.getElementById("category").value,



        name:
        document.getElementById("name").value,



        price:
        Number(
        document.getElementById("price").value),



        memo:
        document.getElementById("memo").value,



        // ===========================
        // クレジットカード追加
        // ===========================

        credit_card_id:
        document.getElementById(
            "credit_card_id"
        ).value || null


    };





    const { error } =
    await db
    .from("expenses")
    .insert(expense);





    if(error){


        console.error(error);


        alert("登録失敗");


        return;


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







    alert("登録成功");







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