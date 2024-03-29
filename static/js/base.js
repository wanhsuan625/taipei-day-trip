// --- OPEN AND CLOSE SINGIN/SIGNUP BOX --------------------------------
const header = document.querySelector("header");
const nav_signInButton = document.querySelector("#menuSignButton");
const nav_bookingButton = document.querySelector("#menuBookingButton");
const nav_signOutButton = document.querySelector("#menuSignOutButton");
const nav_memberButton = document.querySelector("#menuMemberButton");
const nav_memberContainer = document.querySelector(".item__member-container");
const signInContainer = document.querySelector("#signInContainer");
const signUpContainer = document.querySelector("#signUpContainer");
const closeIcon = document.querySelectorAll(".sign__close-icon");
const switchTosignUp = document.querySelector(".switch-to-signUp");
const switchTosignIn = document.querySelectorAll(".switch-to-signIn");
const blackScreen = document.querySelector(".black-screen");
const signWarn = document.querySelector("#signWarn");

const signUpName = document.querySelector("#signUpName");
const signUpEmail = document.querySelector("#signUpEmail");
const signUpPassword = document.querySelector("#signUpPassword");
const signUpNameErrorMessage = document.querySelector("#signUpNameErrorMessage");
const signUpEmailErrorMessage = document.querySelector("#signUpEmailErrorMessage");
const signUpPasswordErrorMessage = document.querySelector("#signUpPasswordErrorMessage");
const signUpSubmitErrorMessage = document.querySelector("#signUpSubmitErrorMessage");
const signUpButton = document.querySelector("#signUpButton");

const signInEmail = document.querySelector("#signInEmail");
const signInPassword = document.querySelector("#signInPassword");
const signInErrorMessage = document.querySelector("#signInErrorMessage");
const signInButton = document.querySelector("#signInButton");

const signUpSuccess = document.querySelector("#signUpSuccess");
const signInSuccess = document.querySelector("#signInSuccess");

// --- CONTAIN LOGIN STATUS ---------------------------------------
window.addEventListener("load", () =>{
    fetch("/api/user/auth",{
        method: "GET",
        headers: {'Content-type':'application/json'}
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.data !== null){
            nav_signInButton.style.display = "none";
            nav_memberButton.style.display = "block";
            nav_memberContainer.style.display = "block";
        }
        return
    })
})

// --- NAVBAR__RWD SETTING : SCREEN BELOW 480 px ----------------------
const nav_bars = document.querySelector("#bars");
const nav_menu = document.querySelector(".nav__menu");
let barsClick = true;

let navbarIconSwitch = (removeClassName, addClassName, maxHeight, clickBoolean, topValue) => {
    nav_bars.classList.remove(removeClassName);
    nav_bars.classList.add(addClassName);
    nav_menu.style = `height: ${maxHeight}px`;
    barsClick = clickBoolean;
    if(document.cookie != ""){
        nav_memberContainer.style = `top: ${topValue}px;`;
    }
}
// 折疊式選單
let menu_minus_memberContainer_height;
nav_bars.addEventListener("click",() => {
    menu_minus_memberContainer_height = nav_menu.scrollHeight - nav_memberContainer.scrollHeight;
    if(barsClick){
        navbarIconSwitch( "fa-bars", "fa-xmark", menu_minus_memberContainer_height , false , 0);
        return;
    }
    navbarIconSwitch( "fa-xmark", "fa-bars", 0, true , 27);
    nav_memberButton.classList.remove("menu__item--collapse");
    nav_memberButton.setAttribute("data-text", "+");
    memberClick = true;
})

window.addEventListener("resize", () => {
    if( window.innerWidth > 480 ){
        navbarIconSwitch( "fa-xmark", "fa-bars", 0, true , 27);
        nav_memberButton.classList.remove("menu__item--collapse");
        nav_memberButton.setAttribute("data-text", "+");
        memberClick = true;
    }
})

// --- 未登入狀態 -----------------------------------------------
window.addEventListener("mouseup", (event) => {
    if ( window.innerWidth > 480){ return;}
    if ( event.target == nav_bars ){ return;}
    if ( document.cookie != ""){ 
        if (event.target == nav_memberButton){ return;}
        navbarIconSwitch( "fa-xmark", "fa-bars", 0, true , 27);
        return;
    }
    navbarIconSwitch( "fa-xmark", "fa-bars", 0, true , 27);
})

// --- 會員專區按鈕 below 480，折疊式選單 -------------------------
let memberClick = true;
nav_memberButton.addEventListener("click", () => {
    if (window.innerWidth > 480) { return;}
    if(memberClick){
        nav_menu.style = `height: ${nav_menu.scrollHeight}px`;
        nav_memberButton.classList.add("menu__item--collapse");
        nav_memberButton.setAttribute("data-text", "-");
        nav_memberContainer.style = "transform: translate(0)";
        memberClick = false;
        return;
    }
    nav_menu.style = `height: ${menu_minus_memberContainer_height}px`;
    nav_memberButton.classList.remove("menu__item--collapse");
    nav_memberButton.setAttribute("data-text", "+");
    nav_memberContainer.style = "transform: translateY(-500px)";
    memberClick = true;
})

// hover設定，在會員選單出現時，也維持不變
nav_memberContainer.addEventListener("mouseenter", () => {
    nav_memberButton.classList.add("menu__item--hover");
});
nav_memberContainer.addEventListener("mouseleave", () => {
    nav_memberButton.classList.remove("menu__item--hover");
})


// --- 登入框、註冊框上的所有按鈕效果 ---
//  關閉按鈕
closeIcon.forEach((e) => {
    e.addEventListener("click",() => {
        signInInfoClear();
        signUpInfoClear();
        signInContainer.style.display = "none";
        signUpContainer.style.display = "none";
        signUpSuccess.style.display = "none";
        blackScreen.style.display = "none";
    })
})
// 從登入框轉換至 註冊框
switchTosignUp.addEventListener("click", () => {
    signInInfoClear();
    signUpContainer.style.display = "block";
    signInContainer.style.display = "none";
})
// 從註冊框轉換至 登入框
switchTosignIn.forEach((e) => {
    e.addEventListener("click", () => {
        signUpInfoClear();
        signUpContainer.style.display = "none";
        signUpSuccess.style.display = "none";
        signInContainer.style.display = "block";
        blackScreen.style.display = "block";
    })
})

//  格式化 註冊框的資料
let signUpInfoClear = () => {
    signUpName.value = "";
    signUpEmail.value = "";
    signUpPassword.value = "";
    signUpName.style.border = "";
    signUpEmail.style.border = "";
    signUpPassword.style.border = "";
    signUpNameErrorMessage.style.display = "none";
    signUpEmailErrorMessage.style.display = "none";
    signUpPasswordErrorMessage.style.display = "none";
    signUpSubmitErrorMessage.style.display = "none";
    signUpButton.setAttribute("disabled","disabled");
}
//  格式化 登入框的資料
let signInInfoClear = () => {
    // signInEmail.value = "";
    signInPassword.value = "";
    signInEmail.style.border = "";
    signInPassword.style.border = "";
    signInErrorMessage.style.display = "none";
    signInButton.setAttribute("disabled","disabled");
}

//  未登入狀態 - NAVBAR上的按鈕
nav_signInButton.addEventListener("click",() => {
    signWarn.style.display = "none";
    if(document.cookie == ""){
        signInContainer.style.display = "block";
        blackScreen.style.display = "block";
    }
    
})
nav_bookingButton.addEventListener("click", () => {
    signInContainer.style.display = "none";
    if(document.cookie == ""){
        signWarn.style.display = "block";
        blackScreen.style.display = "block";
    }
})

// 警示登入框
const signWarnSignInButton = document.querySelector("#signWarnSignInButton");
const signWarnCancelButton = document.querySelector("#signWarnCancelButton");

signWarnSignInButton.addEventListener("click", () => {
    signWarn.style.display = "none";
    signInContainer.style.display = "block";
})
signWarnCancelButton.addEventListener("click", () => {
    signWarn.style.display = "none";
    blackScreen.style.display = "none";
})

//  登入狀態
nav_bookingButton.addEventListener("click",() => {
    if(document.cookie != ""){
        document.location.href = "/booking";
    }
})

//  密碼可見
let secretEye = document.querySelectorAll(".input-group__password-eye");
let eyeClick = true;

secretEye.forEach((e) => {
    e.addEventListener("click", () => {
        if(eyeClick){
            e.classList.remove("fa-eye-slash");
            e.classList.add("fa-eye");
            signInPassword.type = "text";
            signUpPassword.type = "text";
            eyeClick = false;
        }
        else{
            e.classList.remove("fa-eye");
            e.classList.add("fa-eye-slash");
            signInPassword.type = "password";
            signUpPassword.type = "password";
            eyeClick = true;
        }
    })
})


// --- Regular Expression ---------------
const regName = new RegExp("^[\\u4e00-\\u9fa5a-zA-Z0-9._-]+$");
const regEmail = new RegExp("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
const regPassword = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$");

function errorMessage(input, element, message){
    input.style.outline = "none";
    input.style.border = "1px solid red";
    element.style.display = "block";
    element.textContent = message;
}

// --- SING_UP VALIDITY ---
// sign_up validity ── Username
let signUpNameLoad;
let signUpEmailLoad;
let signUpPasswordLoad;

signUpName.addEventListener("change", () => {
    signUpNameLoad = false;
    switch (true) {
        case (signUpName.value === ""):
            errorMessage( signUpName, signUpNameErrorMessage, "⚠ 請輸入姓名" );
            break;
        case (signUpName.value.length > 8 || signUpName.value.length < 1):
            errorMessage( signUpName, signUpNameErrorMessage, "⚠ 姓名長度需介於1~8字元" );
            break;
        case (!regName.test(signUpName.value)):
            errorMessage( signUpName, signUpNameErrorMessage, "⚠ 姓名格式不符，請重新填寫" );
            break;
        default:
            signUpName.style = "border: 1px solid #CCCCCC";
            signUpNameErrorMessage.style.display = "none";
            signUpNameLoad = true;
    }
});


// sign_up validity ── Email
signUpEmail.addEventListener("change", () => {
    signUpEmailLoad = false;
    switch (true) {
        case (signUpEmail.value === ""):
            errorMessage( signUpEmail, signUpEmailErrorMessage , "⚠ 請輸入電子信箱" );
            break;
        case (!regEmail.test(signUpEmail.value)):
            errorMessage( signUpEmail, signUpEmailErrorMessage , "⚠ 信箱格式不符，請輸入正確格式" );
            break;
        default:
            signUpEmail.style = "border: 1px solid #CCCCCC";
            signUpEmailErrorMessage.style.display = "none";
            signUpEmailLoad = true;
    }
});


// sign_up validity ── Password
signUpPassword.addEventListener("change", () => {
    signUpPasswordLoad = false;
    switch (true) {
        case (signUpPassword.value === ""):
            errorMessage( signUpPassword , signUpPasswordErrorMessage , "⚠ 請輸入密碼" );
            break;
        case (signUpPassword.value.length > 15 || signUpPassword.value.length < 8 ):
            errorMessage( signUpPassword , signUpPasswordErrorMessage , "⚠ 密碼長度需介於8~15字元" );
            break;
        case (!regPassword.test(signUpPassword.value)):
            errorMessage( signUpPassword , signUpPasswordErrorMessage, "⚠ 密碼格式不符，請重新填寫" );
            break;
        default:
            signUpPassword.style = "border: 1px solid #CCCCC";
            signUpPasswordErrorMessage.style.display = "none";
            signUpPasswordLoad = true;
    }
});

signUpName.addEventListener("input", () => { signUpSubmitErrorMessage.style.display = "none";})
signUpEmail.addEventListener("input", () => { signUpSubmitErrorMessage.style.display = "none";})
signUpPassword.addEventListener("input", () => { signUpSubmitErrorMessage.style.display = "none";})
signInEmail.addEventListener("input", () => { signInErrorMessage.style.display = "none";})
signInPassword.addEventListener("input", () => { signInErrorMessage.style.display = "none";})

// --- BUTTON DISABLED ATTRIBUTE CHANGE ---------------------------------------
let signButtonDisable = ( ) => {
    if ( signUpName.value != "" && signUpEmail.value != "" && signUpPassword.value != ""
         && signUpNameLoad && signUpEmailLoad && signUpPasswordLoad){
        signUpButton.removeAttribute("disabled");
    }
    else if( signInEmail.value != "" && signInPassword.value != "" ){
            signInButton.removeAttribute("disabled");
    }
    else{
        signUpButton.setAttribute("disabled", "disabled");
        signInButton.setAttribute("disabled", "disabled");
    }
}
signUpName.addEventListener("change", signButtonDisable);
signUpEmail.addEventListener("change", signButtonDisable);
signUpPassword.addEventListener("change", signButtonDisable);
signInEmail.addEventListener("input", signButtonDisable);
signInPassword.addEventListener("input", signButtonDisable);


// 傳送 SIGN_UP 資料
signUpButton.addEventListener("click",() => { signUpFetch()});

let signUpFetch = () => {
    fetch("/api/user", {
        method : "POST",
        headers: {'Content-type':'application/json'},
        body : JSON.stringify({
                "name" : signUpName.value,
                "email" : signUpEmail.value,
                "password" : signUpPassword.value})
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.ok == true){
            // 註冊成功畫面
            signUpContainer.style.display = "none";
            signUpSuccess.style.display = "block";
            return;
        }
        signUpSubmitErrorMessage.style.display = "block";
        signUpSubmitErrorMessage.textContent = data.message;
    })
}

// 傳送 SIGN_IN 資料
signInButton.addEventListener("click", ()=> { signInFetch()});
let signInFetch = () => {
    fetch("/api/user/auth",{
        method: "PUT",
        headers: {'Content-type':'application/json'},
        body : JSON.stringify({
                "email" : signInEmail.value,
                "password" : signInPassword.value})
    }).then(response => {
        return response.json();
    }).then(data =>{
        if(data.ok == true){
            // 登入成功畫面
            signInContainer.style.display = "none";
            signInSuccess.style.display = "block";
            setTimeout( function() {
                location.reload()
            }, 2000);
        }
        signInErrorMessage.style.display = "block";
        signInErrorMessage.textContent = data.message;
    })
}

// --- SINGN_OUT ------------------------------------------------------
nav_signOutButton.addEventListener("click", () => {
    fetch("/api/user/auth",{
        method: "DELETE",
        headers: {'Content-type':'application/json'}
    })
    .then(response => {
        return response.json()
    }).then(data => {
        if(data.ok == true){
            nav_signInButton.style.display = "block";
            nav_memberButton.style.display = "none";
            nav_memberContainer.style.display = "none";
            window.location.reload();  // 登出成功，畫面重載
        }
    })
})

// --- SETTING TO_TOP_BUTTON EFFECT ------------------------------------------------
let topButton = document.querySelector(".top-button");

window.addEventListener("scroll", () => scrollPage());
topButton.addEventListener("click", () => backTop());

function scrollPage(){
    if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
        topButton.style.display = "block";
        header.style.boxShadow = "0px 3px 10px #757575" ;
    }
    else{
        topButton.style.display = "none";
        header.style.boxShadow = "none";
    }
}
function backTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}