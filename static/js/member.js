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
    location.href = "/account/order";
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

                <div class="member__password__message" id="memberPasswordMessage">
                密碼長度需為8~15位，並且須包含一個大寫字母、一個小寫字母及一個數字</div>
                <div class="member__password__message message-error" id="errorMessage"></div>
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
let func_change_message = (e, message, color_change, font_size_change, input, input_border) => {
    e.textContent = message;
    e.style = color_change;
    e.style.fontSize = font_size_change;
    input.style = input_border;
}

let change_user_name = () => {
    member_name = document.querySelector("#memberName");
    let change_name_box = 
        `<div class="change__username-box">
            <label for="changeUsername" class="change__headline">
                新名稱<input type="text" id="changeUsername" class="change__input" placeholder="須介於1-8個字元">
            </label>
            <div class="change__message" id="changeMessage">可用符號 "." , "_" 以及 "─"</div>
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

    change_name_input.addEventListener("input", () => {
        func_change_message(
            change_error_message, '可用符號 "." , "_" 以及 "─"', "color : var(--secondary);", "12px" ,
             change_name_input, "border: 0;" );  
    })

    // 新名稱 - 確認變更
    username_confirm.addEventListener("click", ()=>{
        if(change_name_input.value){
            if (change_name_input.value.length < 1 || change_name_input.value.length > 8) {
                func_change_message(
                    change_error_message, "須介於1~8個字元", "color : var(--error);", "14px",
                     change_name_input, "border: 1px solid var(--error);" );  
            }
            else if (!regName.test(change_name_input.value)){
                func_change_message(
                    change_error_message, "格式不符，請重新填寫", "color : var(--error);", "14px",
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
                change_error_message, "請輸入新的使用者名稱", "color : var(--error);", "14px",
                 change_name_input, "border: 1px solid var(--error);" );
        }
    })

    // 新名稱 - 取消變更
    username_cancel.addEventListener("click",()=>{
        func_change_message(
            change_error_message, '可用符號 "." , "_" 以及 "─"', "color : var(--secondary-dark);", "12px" ,
             change_name_input, "border: 0;" );
        change_name_input.value = "";
        usernameBox.style.display = "none";
    })
}

// --- 密碼變更 -----------------------------------------------------------------
let password_warning_text = ( element , message , error) => {
    element.addEventListener("input", () => {
        message.style.display = "block";
        error.style.display = "none";
    })
}

let change_password = () => {
    let usernameBox = document.querySelector(".change__username-box");
    member_email = document.querySelector("#memberEmail");
    let old_password = document.querySelector("#passwordOld");
    let new_password = document.querySelector("#passwordNew");
    let confirm_password = document.querySelector("#passwordConfirm");
    let password_message = document.querySelector("#memberPasswordMessage");
    let password_error_message = document.querySelector("#errorMessage");
    
    password_warning_text( old_password , password_message , password_error_message);
    password_warning_text( new_password , password_message , password_error_message);
    password_warning_text( confirm_password , password_message , password_error_message);


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
                password_error_message.style.display = "none";
                password_message.style.display = "block";
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
                password_message.style.display = "none";
                password_error_message.style.display = "block";
                password_error_message.innerHTML = data.message;
            }
        }
    )
}


// 初始畫面
fetch_change_member_data();