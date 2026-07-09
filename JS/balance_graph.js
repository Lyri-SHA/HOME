// ===========================
// 変数
// ===========================

let balanceChart = null;

let accounts = [];

let histories = [];




// ===========================
// 初期処理
// ===========================

window.onload = async function(){


    await loadAccounts();


    await loadHistory();


    createAccountList();


    drawGraph();



    document
    .getElementById("account")
    .addEventListener(
        "change",
        drawGraph
    );


    document
    .getElementById("period")
    .addEventListener(
        "change",
        drawGraph
    );


};




// ===========================
// 口座取得
// ===========================

async function loadAccounts(){


    const {

        data,

        error

    } = await db

    .from("accounts")

    .select("*")

    .order(
        "id",
        {
            ascending:true
        }
    );



    if(error){

        console.error(error);

        return;

    }



    accounts = data;


}






// ===========================
// 履歴取得
// ===========================

async function loadHistory(){


    const {

        data,

        error

    } = await db

    .from("balance_history")

    .select("*")

    .order(

        "date",

        {

            ascending:true

        }

    );



    if(error){

        console.error(error);

        return;

    }



    histories = data;


}






// ===========================
// 口座リスト作成
// ===========================

function createAccountList(){


    const select =

    document

    .getElementById("account");



    accounts.forEach(account => {


        const option =

        document.createElement("option");



        option.value =

        account.id;



        option.textContent =

        account.name;



        select.appendChild(option);



    });


}






// ===========================
// グラフ作成
// ===========================

function drawGraph(){



    const accountId =

    document

    .getElementById("account")

    .value;



    const period =

    document

    .getElementById("period")

    .value;



    let list =

    histories.filter(

        x =>

        x.account_id == accountId

    );



    console.log("選択口座ID", accountId);

    console.log("口座抽出後", list);





    // =======================
    // 期間
    // =======================


    const today =

    new Date();



    const nowYear =

    today.getFullYear();



    const nowMonth =

    today.getMonth() + 1;





    if(period === "year"){


        list =

        list.filter(x => {


            const date =

            x.date.split("T")[0];



            const year =

            Number(

                date.substring(0,4)

            );



            return year === nowYear;


        });


    }





    if(period === "month"){


    list =

    list.filter(x => {


        const date =

        x.date.split("T")[0];



        const year =

        Number(

            date.substring(0,4)

        );



        const month =

        Number(

            date.substring(5,7)

        );



        return year === nowYear && month === nowMonth;


    });


}



    console.log("期間後データ", list);






    // =======================
    // グラフデータ
    // =======================


    const labels =

    list.map(

        x => x.date.split("T")[0]

    );



    const values =

    list.map(

        x => x.balance

    );






    // =======================
    // グラフ作成
    // =======================


    if(balanceChart){


        balanceChart.destroy();


    }





    balanceChart =

    new Chart(


        document

        .getElementById(

            "balanceChart"

        ),


        {


            type:"line",



            data:{


                labels:labels,



                datasets:[


                    {


                        label:"残高",


                        data:values,



                        tension:0.3


                    }


                ]



            },



            options:{


                responsive:true,



                plugins:{


                    legend:{


                        position:"bottom"


                    }


                }



            }



        }


    );







    // =======================
    // 現在残高
    // =======================


    if(list.length > 0){


        const last =

        list[list.length - 1];



        document

        .getElementById(

            "current-balance"

        )

        .textContent =


        "¥"

        +

        Number(last.balance)

        .toLocaleString();



    }
    else{


        document

        .getElementById(

            "current-balance"

        )

        .textContent =

        "¥0";


    }



}