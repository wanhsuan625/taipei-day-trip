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

    fetch_change_member_data();
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
//  訂單詳情
let order_list_html = 
`<div class="list__container">
    <div class="list__title order__number"></div>
    <img class="list__close-icon" src="/image/icon_close.png" alt="">
    <div class="list__box">
        <img class="list__img" src="" alt="">
        <div class="list__content-box">
            <div class="list__content-title"></div>
            <div class="list__content-innerBox">
                <div class="list__headline">景區地點：</div>
                <div class="list__content" id="listAddress"></div>
            </div>
            <div class="list__content-innerBox">
                <div class="list__headline">訂購人：</div>
                <div class="list__content" id="listContacter"></div>
            </div>
            <div class="list__content-innerBox">
                <div class="list__headline">信箱：</div>
                <div class="list__content" id="listEmail"></div>
            </div>
            <div class="list__content-innerBox">
                <div class="list__headline">電話：</div>
                <div class="list__content" id="listPhone"></div>
            </div>
            <div class="list__content-innerBox">
                <div class="list__headline">出發日期：</div>
                <div class="list__content" id="listDate"></div>
            </div>
            <div class="list__content-innerBox">
                <div class="list__headline">場次：</div>
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
                    list_phone.textContent = result_order[i].contact_phone;
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