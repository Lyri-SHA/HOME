// ===========================
// グローバル変数
// ===========================

let chart = null;

let expenses = [];


// ===========================
// 初期処理
// ===========================

window.onload = async function () {

    await loadExpenses();

    createCategoryList();

    drawGraph();

    document
        .getElementById("period")
        .addEventListener("change", drawGraph);

    document
        .getElementById("category")
        .addEventListener("change", drawGraph);

};




// ===========================
// 支出取得
// ===========================

async function loadExpenses() {

    const { data, error } =
        await db
            .from("expenses")
            .select("*")
            .order("date", { ascending: true });

    if (error) {

        console.error(error);

        alert("データ取得失敗");

        return;

    }

    expenses = data;

}




// ===========================
// カテゴリー一覧
// ===========================

function createCategoryList() {

    const select =
        document.getElementById("category");

    const categories =
        [...new Set(expenses.map(x => x.category))];

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);

    });

}




// ===========================
// グラフ描画
// ===========================

function drawGraph() {

    const period =
        document.getElementById("period").value;

    const category =
        document.getElementById("category").value;

    let list = [...expenses];



    // -----------------------
    // 期間
    // -----------------------

    const today =
        new Date();



    if (period === "year") {

        const year =
            today.getFullYear();

        list =
            list.filter(x =>
                new Date(x.date).getFullYear() === year
            );

    }



    if (period === "month") {

        const year =
            today.getFullYear();

        const month =
            today.getMonth();

        list =
            list.filter(x => {

                const d =
                    new Date(x.date);

                return d.getFullYear() === year &&
                    d.getMonth() === month;

            });

    }



    // -----------------------
    // カテゴリー
    // -----------------------

    if (category !== "all") {

        list =
            list.filter(x =>
                x.category === category
            );

    }



    // -----------------------
    // 円グラフ集計
    // -----------------------

    const totalByCategory = {};



    list.forEach(item => {

        if (!totalByCategory[item.category]) {

            totalByCategory[item.category] = 0;

        }

        totalByCategory[item.category] += item.price;

    });



    const labels =
        Object.keys(totalByCategory);

    const values =
        Object.values(totalByCategory);



    // -----------------------
    // グラフ再生成
    // -----------------------

    if (chart) {

        chart.destroy();

    }



    chart =
        new Chart(

            document
                .getElementById("expenseChart"),

            {

                type: "pie",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data: values

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }

        );



    // -----------------------
    // 合計
    // -----------------------

    const total =
        list.reduce(
            (sum, x) => sum + x.price,
            0
        );



    document
        .getElementById("total-price")
        .textContent =
        "¥" +
        total.toLocaleString();



    document
        .getElementById("total-count")
        .textContent =
        list.length + "件";

}