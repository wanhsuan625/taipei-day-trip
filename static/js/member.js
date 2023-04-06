const article = document.querySelector("article");
const username = document.querySelector("#memberUsername");
let changeData = document.getElementById("changeData");
let orderRecord = document.getElementById("orderRecord");
let logout = document.getElementById("Logout");

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

    fetch_change_member_data();
})

orderRecord.addEventListener("click", () => {
    orderRecord.classList.add("select-option");
    changeData.classList.remove("select-option");

    fetch_order_record();
})


// --- 變更會員資料介面 -------------------------------------------------------------------
let member_html = 
   `<div class="member__container">
        <div class="member__box">
            <div class="member__content member__headline">使用者名稱</div>
            <div class="member__content member__text" id="memberName">
                <button type="button" class="change__username-button">變更</button>
            </div>
        </div>

        <div class="member__box">
            <div class="member__content member__headline">Email</div>
            <div class="member__content member__text" id="memberEmail"></div>
        </div>

        <!-- 密碼變更 -->
        <div class="member__box">
            <div class="member__content member__headline">更改密碼</div>
            <form class="member__password__box">
                <label for="passwordOld" class="password__text">舊密碼
                    <input
                        id="passwordOld"
                        type="password"
                        class="member__password"
                        autocomplete="current-password">
                </label>
                <label for="passwordNew" class="password__text">新密碼
                    <input
                        id="passwordNew"
                        type="password"
                        class="member__password"
                        autocomplete="new-password">
                </label>
                <label for="passwordConfirm" class="password__text">確認密碼
                    <input
                        id="passwordConfirm"
                        type="password"
                        class="member__password"
                        autocomplete="new-password">
                </label>
                <div class="member__password__message"></div>
            </form>
        </div>

        <div class="button__box">
            <button type="button" class="member__button">確認變更</button>
        </div>
    </div>`;

let member_name;
let member_email;
let fetch_change_member_data = () =>{
    fetch("/api/user/auth")
    .then(response => {return response.json();})
    .then(
        data => {
            let result_user = data.data;
            article.textContent = "";
            let changeData_headline = `
                <div class="article__title">變更資料</div>
                <p class="article__subtitle">管理您的檔案以保護您的帳戶安全</p>
                <hr class="article__hr">
            `;
            article.insertAdjacentHTML("afterbegin", changeData_headline);
            article.insertAdjacentHTML("beforeend", member_html);

            // 寫入-使用者資料
            member_name = document.querySelector("#memberName");
            member_email = document.querySelector("#memberEmail");
            member_name.insertAdjacentText("afterbegin", result_user.name);
            member_email.textContent = result_user.email;

            // 使用者名稱變更
            change_user_name();

            // 密碼變更
            let password_confirm_button = document.querySelector(".member__button");
            password_confirm_button.addEventListener("click", () => {
                change_password();
            })
        }
    )
}
// 初始畫面
fetch_change_member_data();


// --- 使用者名稱變更 -----------------------------------------------------------------
// 變更框之函式 - 不同情況的變化
let func_change_message = (e, message, style_change, input, input_border) => {
    e.textContent = message;
    e.style = style_change;
    input.style = input_border;
}

let change_user_name = () => {
    member_name = document.querySelector("#memberName");
    let change_name_box = 
        `<div class="change__username-box">
            <label for="changeUsername" class="change__headline">
                新名稱<input type="text" id="changeUsername" class="change__input">
            </label>
            <div class="change__message" id="changeMessage">須介於1-8個字元</div>
            <div class="change__button-box">
                <button type="submit" class="change__button change__button-confirm">儲存</button>
                <button type="submit" class="change__button change__button-cancel">取消</button>
            </div>
        </div>`;
    member_name.insertAdjacentHTML("beforeend", change_name_box);

    let usernameButton = document.querySelector(".change__username-button");
    let usernameBox = document.querySelector(".change__username-box");
    let username_confirm = document.querySelector(".change__button-confirm");
    let username_cancel = document.querySelector(".change__button-cancel");

    usernameButton.addEventListener("click", () => {
        usernameBox.style.display = "block";
    })

    // 新名稱填入的反饋
    let change_name_input = document.querySelector("#changeUsername");
    let change_error_message = document.querySelector("#changeMessage");
    let member_email = document.querySelector("#memberEmail");

    // 新名稱 - 確認變更
    username_confirm.addEventListener("click", ()=>{
        if(change_name_input.value){
            if (change_name_input.value.length < 1 || change_name_input.value.length > 8) {
                func_change_message(
                    change_error_message, "須介於1-8個字元", "color: var(--error);",
                     change_name_input, "border: 1px solid var(--error);" );  
            }
            else{
                // 新名稱 - 修改成功：改寫資料庫
                fetch("/api/member/username", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-type":"application/json"
                    },
                    body: JSON.stringify({
                        "username": change_name_input.value,
                        "email": member_email.textContent})
                })
                .then( response => { return response.json();})
                .then( data => {
                    if (data.ok == true){
                        let change_name_success_html = 
                            `<i class="fa-solid fa-circle-check change__success-icon"></i>
                            <span class= "change__success-text">修改成功</span>`;

                        usernameBox.innerHTML = "";
                        usernameBox.classList.add("change__success-box");
                        usernameBox.insertAdjacentHTML("afterbegin", change_name_success_html);
                    }
                })
                
                // 重新整理頁面
                setTimeout( ()=> { window.location.reload() }, 1000);
            }
        }
        else{
            func_change_message(
                change_error_message, "請輸入新的使用者名稱", "color: var(--error);",
                 change_name_input, "border: 1px solid var(--error);" );
        }
    })

    // 新名稱 - 取消變更
    username_cancel.addEventListener("click",()=>{
        func_change_message(
            change_error_message, "須介於1-8個字元", "color: var(--secondary-dark);",
             change_name_input, "border: 0;" );
        change_name_input.value = "";
        usernameBox.style.display = "none";
    })
}

// --- 密碼變更 -----------------------------------------------------------------
let change_password = () => {
    let usernameBox = document.querySelector(".change__username-box");
    let member_email = document.querySelector("#memberEmail");
    let old_password = document.querySelector("#passwordOld");
    let new_password = document.querySelector("#passwordNew");
    let confirm_password = document.querySelector("#passwordConfirm");
    let password_message = document.querySelector(".member__password__message");

    fetch("/api/member/password", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"},
        body: JSON.stringify({
            "email": member_email.textContent,
            "oldpassword": old_password.value,
            "newpassword": new_password.value,
            "confirmpassword": confirm_password.value})
    })
    .then(response => { return response.json();})
    .then( data => {
            if ( data.ok ){
                password_message.style.display = "none";
                let change_password_success_html = 
                    `<i class="fa-solid fa-circle-check change__success-icon"></i>
                    <span class= "change__success-text">變更成功，下次登入請使用新密碼</span>`;

                usernameBox.innerHTML = "";
                usernameBox.style.display = "flex";
                usernameBox.classList.add("change__success-box");
                usernameBox.insertAdjacentHTML("afterbegin", change_password_success_html);

                setTimeout( ()=> { window.location.reload() }, 3000);
            }
            else {
                password_message.style.display = "block";
                password_message.innerHTML = data.message;
            }
        }
    )
}


//  --- 取得歷史訂單 -------------------------------------------------------------
let fetch_order_record = () => {
    fetch("/api/orderRecord")
    .then(response => {return response.json();})
    .then(
        data => {
            let result_order = data.data;
            article.textContent = "";
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
                    })
                }
            }
        }
    )
}