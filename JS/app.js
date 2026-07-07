// 家計簿データ
let data = [];


// 追加ボタン
document
.getElementById("add")
.onclick = function(){


    let item = {

        date:
        document.getElementById("date").value,


        name:
        document.getElementById("name").value,


        price:
        Number(
        document.getElementById("price").value)

    };


    data.push(item);


    display();


};



// 表示処理
function display(){


    let list =
    document.getElementById("list");


    list.innerHTML="";


    data.forEach(
        item=>{


        let tr =
        document.createElement("tr");


        tr.innerHTML = `

        <td>${item.date}</td>

        <td>${item.name}</td>

        <td>
        ${item.price.toLocaleString()}円
        </td>

        `;


        list.appendChild(tr);


    });


}