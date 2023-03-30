const article = document.querySelector("article");
const username = document.querySelector("#memberUsername");
let changeData = document.getElementById("changeData");
let orderRecord = document.getElementById("orderRecord");
let logout = document.getElementById("Logout");
let userID;

// ----- 左側個人檔案-點選功能 ------------------------------------------------------
// 取得會員名稱
fetch("/api/user/auth")
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

    fetch_change_member_data();
})

orderRecord.addEventListener("click", () => {
    orderRecord.classList.add("select-option");
    changeData.classList.remove("select-option");

    fetch_order_record();
})


// // 取得會員資料
let fetch_change_member_data = () =>{
    fetch("/api/user/auth")
    .then(response => {return response.json();})
    .then(
        data => {
            article.innerHTML = "";
            let result_user = data.data;
            let changeData_html = `
                <div class="article__title">變更資料</div>
                <p class="article__subtitle">管理您的檔案以保護您的帳戶安全</p>
                <hr class="article__hr">

                <div class="member__container">
                    <div class="member__box">
                        <div class="member__content member__headline">使用者名稱</div>
                        <div class="member__content member__text" id="memberUsername">
                            ${result_user.name}
                            <button type="button" class="change__username-button">變更</button>
                            <div class="change__username-box">
                                <label for="changeUsername" class="change__headline">
                                    新名稱<input type="text" id="changeUsername" class="change__input">
                                </label>
                                <div class="change__button-box">
                                    <button type="submit" class="change__button change__button-confirm">儲存</button>
                                    <button type="submit" class="change__button change__button-cancel">取消</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="member__box">
                        <div class="member__content member__headline">Email</div>
                        <div class="member__content member__text" id="memberEmail">${result_user.email}</div>
                    </div>

                <!-- 密碼變更 -->
                    <div class="member__box">
                        <div class="member__content member__headline">更改密碼</div>
                        <div class="member__password__box">
                            <label for="passwordOld" class="password__text">舊密碼
                                <input
                                    id="passwordOld"
                                    type="password"
                                    class="member__password">
                            </label>
                            <label for="passwordNew" class="password__text">新密碼
                                <input
                                    id="passwordNew"
                                    type="password"
                                    class="member__password">
                            </label>
                            <label for="passwordConfirm" class="password__text">確認密碼
                                <input
                                    id="passwordConfirm"
                                    type="password"
                                    class="member__password">
                            </label>
                        </div>
                    </div>

                    <div class="button__box">
                        <button type="button" class="member__button">確認變更</button>
                    </div>
                </div>
            `;
            article.insertAdjacentHTML("afterbegin", changeData_html);

            // 變更-使用者名稱
            let usernameButton = document.querySelector(".change__username-button");
            let usernameBox = document.querySelector(".change__username-box");
            let username_confirm = document.querySelector(".change__button-confirm");
            let username_cancel = document.querySelector(".change__button-cancel");
            
            usernameButton.addEventListener("click",()=>{
                usernameBox.style.display = "block";
            })
            username_cancel.addEventListener("click",()=>{
                usernameBox.style.display = "none";
            })
            
        }
    )
}


//  取得歷史訂單
let fetch_order_record = () => {
    fetch("/api/orderRecord")
    .then(response => {return response.json();})
    .then(
        data => {
            let result_order = data.data;
            article.innerHTML = "";

            let orderRecord_headline = `
                <div class="article__title">訂購紀錄</div>
                <p class="article__subtitle">方便您檢視已完成付款之行程時間</p>
                <hr class="article__hr">
    
                <div class="order__container"></div>
            `;
            article.insertAdjacentHTML("afterbegin", orderRecord_headline);
            let hr = document.querySelector(".article__hr");
            let order_container = document.querySelector(".order__container");

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

                    // 訂單詳情
                    order_box.addEventListener("click", () => {
                        let time;
                        if ( result_order[i].time == "morning"){
                            time = "上午場 (8:00 ~ 13:00)";
                        }
                        else{
                            time = "下午場 (13:00 ~ 16:00)"
                        };

                        let order_detail_list = `
                            <div class="list__container">
                            <div class="list__title order__number"><span>訂單編號：</span>${result_order[i].order_id}</div>
                            <img class="list__close-icon" src="/image/icon_close.png" alt="">
                            <div class="list__box">
                                <img class="list__img" src="${result_order[i].images}" alt="">
                                <div class="list__content-box">
                                    <div class="list__content-title">${result_order[i].name}</div>
                                    <div class="list__headline">景區地點：
                                        <span class="list__content">${result_order[i].address}</span>
                                    </div>
                                    <div class="list__headline">&emsp;訂購人：
                                        <span class="list__content">${result_order[i].contact_name}</span>
                                    </div>
                                    <div class="list__headline">&emsp;&emsp;信箱：
                                        <span class="list__content">${result_order[i].contact_email}</span>
                                    </div>
                                    <div class="list__headline">&emsp;&emsp;電話：
                                        <span class="list__content">${result_order[i].contact_phone.slice(0,4)}***${result_order[i].contact_phone.slice(-3)}</span>
                                    </div>
                                    <div class="list__headline">出發日期：
                                        <span class="list__content">${result_order[i].date}</span>
                                    </div>
                                    <div class="list__headline">&emsp;&emsp;場次：
                                        <span class="list__content">${time}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="list__button">再次訂購</button>
                        </div>`;
                        article.insertAdjacentHTML("beforeend", order_detail_list);
                    
                        let list_container = document.querySelectorAll(".list__container");
                        let list_close_icon = document.querySelectorAll(".list__close-icon");
                        // console.log(list_container);
                        // console.log(list_close_icon);

                        list_close_icon.forEach( e => {
                            e.addEventListener("click", () => {
                                list_container.forEach( ele => {
                                    ele.style.display = "none";
                                })
                            })
                        })

                        // 再次訂購 - 跳轉至該景點頁面ㄋ
                        let list_button = document.querySelectorAll(".list__button");
                        list_button.forEach(e => {
                            e.addEventListener("click" , () => {
                                window.location.href = `/attraction/${result_order[i].attraction_id}`;
                            })
                        })

                    }) } } } )
}

// 初始畫面
fetch_change_member_data();
