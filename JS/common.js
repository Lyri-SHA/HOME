// ===========================
// 全画面タップ コインエフェクト
// ===========================


document.addEventListener(
"click",
function(e){


    createCoins(
        e.clientX,
        e.clientY
    );


});





// ===========================
// 円形コイン生成
// ===========================


function createCoins(x, y){


    const count = 10;


    for(
        let i = 0;
        i < count;
        i++
    ){


        const coin =
        document.createElement("div");



        coin.className =
        "coin-effect";



        coin.textContent =
        "🪙";



        coin.style.left =
        x + "px";


        coin.style.top =
        y + "px";



        // 円方向

        const angle =
        (360 / count) * i;



        const distance =
        100 + Math.random() * 50;



        const moveX =
        Math.cos(
            angle * Math.PI / 180
        )
        * distance;



        const moveY =
        Math.sin(
            angle * Math.PI / 180
        )
        * distance;



        coin.style.setProperty(
            "--move-x",
            moveX + "px"
        );


        coin.style.setProperty(
            "--move-y",
            moveY + "px"
        );



        document.body.appendChild(
            coin
        );



        setTimeout(
            ()=>{

                coin.remove();

            },
            800
        );


    }


}