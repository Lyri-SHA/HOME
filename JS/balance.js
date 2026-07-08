// ===========================
// 口座一覧取得
// ===========================

async function loadAccounts(){


    const { data, error } = await db
        .from("accounts")
        .select("*")
        .order("id");



    if(error){

        console.error(error);

        alert("口座情報取得失敗");

        return;

    }



    const list =
        document.getElementById("account-list");



    list.innerHTML = "";



    data.forEach(account => {



        const button =
            document.createElement("button");



        button.className =
            "account-button";



        button.innerHTML = `

            <span>
                ${account.name}
            </span>

            <span>
                ${account.balance.toLocaleString()}円
            </span>

        `;



        // クリック時

        button.onclick = function(){


            location.href =
            "balance_edit.html?id="
            + account.id;


        };



        list.appendChild(button);



    });



}



// ===========================
// 起動
// ===========================

window.onload = function(){

    loadAccounts();

};