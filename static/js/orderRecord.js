const article = document.querySelector("article");
const username = document.querySelector("#memberUsername");
let changeData = document.getElementById("changeData");
let orderRecord = document.getElementById("orderRecord");
let logout = document.getElementById("logOut");

// ----- 左側個人檔案-點選功能 ------------------------------------------------------
// 取得會員名稱
fetch("/api/user/auth",{
    method: "GET",
    headers: { "Content-Type": "application/json" }
})
.then(response => {return response.json();})
.then(
    data => {
        let result = data.data;
        username.textContent = result.name;
    }
)

// 選項變更
changeData.addEventListener("click", () => {
    changeData.classList.add("select-option");
    orderRecord.classList.remove("select-option");
    location.href = "/account/member";
})

orderRecord.addEventListener("click", () => {
    orderRecord.classList.add("select-option");
    changeData.classList.remove("select-option");
    fetch_order_record();
})

// --- 登出 -----------------------------------------------------------------------------
logout.addEventListener("click",() =>{
    if(document.cookie != ""){
        fetch("/api/user/auth",{
            method: "DELETE",
            headers: {'Content-type':'application/json'}
        })
        .then(response => {
            return response.json()
        }).then(data => {
            if(data.ok == true){
                window.location.href = "/";  // 登出成功，回首頁
            }
        })
    }
})

//  --- 取得歷史訂單 -------------------------------------------------------------
//  訂單詳情
let order_list_html = 
`<div class="list__container">
    <div class="list__title order__number"></div>
    <img class="list__close-icon" src="/image/icon_close.png" alt="">
    <div class="list__box">
        <img class="list__img" src="" alt="">
        <div class="list__content-box">
            <div class="list__content-title"></div>
            <div class="list__content-subtitle" id="listAddress"></div>
            <div class="list__table">
                <div class="list__headline list-topBorder">訂購人</div>
                <div class="list__content list-topBorder" id="listContacter"></div>
            </div>
            <div class="list__table">
                <div class="list__headline">信箱</div>
                <div class="list__content" id="listEmail"></div>
            </div>
            <div class="list__table">
                <div class="list__headline">電話</div>
                <div class="list__content" id="listPhone"></div>
            </div>
            <div class="list__table">
                <div class="list__headline">出發日期</div>
                <div class="list__content" id="listDate"></div>
            </div>
            <div class="list__table">
                <div class="list__headline">場次</div>
                <div class="list__content" id="listTime"></div>
            </div>

        </div>
    </div>
    <button class="list__button">再次訂購</button>
</div>`;

let fetch_order_record = () => {
    //  更改 article 的 title
    article.textContent = "";
    article.insertAdjacentHTML("beforeend", order_list_html);

    let orderRecord_headline = `
        <div class="article__title">訂購紀錄</div>
        <p class="article__subtitle">方便您檢視已完成付款之行程時間</p>
        <hr class="article__hr">

        <div class="order__container"></div>
    `;
    article.insertAdjacentHTML("afterbegin", orderRecord_headline);

    //  order_list_detail 變數
    const hr = document.querySelector(".article__hr");
    const order_container = document.querySelector(".order__container");
    const list_container = document.querySelector(".list__container");
    const list_number = document.querySelector(".order__number");
    const list_img = document.querySelector(".list__img");
    const list_attraction_name = document.querySelector(".list__content-title");
    const list_address = document.querySelector("#listAddress");
    const list_contacter = document.querySelector("#listContacter");
    const list_email = document.querySelector("#listEmail");
    const list_phone = document.querySelector("#listPhone");
    const list_date = document.querySelector("#listDate");
    const list_time = document.querySelector("#listTime");
    const list_close_icon = document.querySelector(".list__close-icon");
    const list_button = document.querySelector(".list__button");

    //   匯入訂單資料
    fetch("/api/orderRecord")
    .then(response => {return response.json();})
    .then(data => {
        let result_order = data.data;
        if (result_order == null){
            // 無訂單
            let no_order =
                `<div class="no_order__box">
                    <img class="no_order__img" src="/image/no_reservation.png" alt="">
                    <h3 class="no_order__text">您目前無已訂購之行程</h3>
                </div>`
            hr.insertAdjacentHTML("afterend", no_order);
        }
        else{
            // 抓取訂單數量
            for( let i = 0; i < result_order.length; i++ ){
                let order_box = document.createElement("div");
                order_box.className = "order__box";
                order_container.appendChild(order_box);

                // 訂單編號;
                let order_number = document.createElement("div");
                order_number.className = "order__number";
                order_number.textContent = result_order[i].order_id;
                order_box.appendChild(order_number);

                let number_span = "<span>訂單編號：</span>";
                order_number.insertAdjacentHTML("afterbegin", number_span);

                // 景點圖片
                let img_box = document.createElement("div");
                img_box.className = "order__img-box";
                order_box.appendChild(img_box);

                let order_img = document.createElement("img");
                order_img.className = "order__img";
                order_img.src = result_order[i].images;
                img_box.appendChild(order_img);

                // 景點名稱
                let order_name = document.createElement("div");
                order_name.className = "order__name";
                order_name.textContent = result_order[i].name;
                img_box.appendChild(order_name)

                // 行程日期
                let order_date = document.createElement("div");
                order_date.className = "order__date";
                order_date.textContent = `出發日期：${result_order[i].date}`;
                order_box.appendChild(order_date);

                let time;
                if ( result_order[i].time == "morning"){
                    time = "上午場 (8:00 ~ 13:00)";
                }else{
                    time = "下午場 (13:00 ~ 16:00)"
                };

                //  展開訂單的詳情
                order_box.addEventListener("click", () => {
                    list_container.style.display = "block";
                    list_number.innerHTML = `<span>訂單編號：</span>${result_order[i].order_id}`;
                    list_img.src = result_order[i].images;
                    list_attraction_name.textContent = result_order[i].name;
                    list_address.textContent = result_order[i].address;
                    list_contacter.textContent = result_order[i].contact_name;
                    list_email.textContent = result_order[i].contact_email;
                    list_phone.textContent = `${result_order[i].contact_phone.slice(0,4)}***${result_order[i].contact_phone.slice(7)}`;
                    list_date.textContent = result_order[i].date;
                    list_time.textContent = time;
                })
                
                //  訂單詳情close
                list_close_icon.addEventListener("click", () => {
                    list_container.style.display = "none";
                })
                
                //  再次購買button - 連結至所選取的景點頁面
                list_button.addEventListener("click", () => {
                    window.location.href = `/attraction/${result_order[i].attraction_id}`;
                })
            }
        }
    })
}
// 初始畫面
fetch_order_record();