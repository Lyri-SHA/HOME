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
        document.getElementById("memo").value

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


    alert("登録成功");
document.getElementById("date").value = "";
document.getElementById("category").value = "";
document.getElementById("name").value = "";
document.getElementById("price").value = "";
document.getElementById("memo").value = "";
}