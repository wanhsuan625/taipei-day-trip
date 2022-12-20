// --- NAVBAR__RWD SETTING : SCREEN BELOW 480 px ----------------------
const nav_bars = document.querySelector("#bars");
const nav_menu = document.querySelector(".nav__menu");
let barsClick = true;

nav_bars.addEventListener("click",() => {
    if(barsClick){
        nav_bars.classList.remove("fa-bars");
        nav_bars.classList.add("fa-xmark");
        nav_menu.style = `height: ${nav_menu.scrollHeight}px`;

        barsClick = false;
    }
    else{
        nav_bars.classList.remove("fa-xmark");
        nav_bars.classList.add("fa-bars");
        nav_menu.style = "height: 0px";

        barsClick = true;
    }
})


// --- OPEN AND CLOSE SINGIN/SIGNUP BOX --------------------------------
const header = document.querySelector("header");
const nav_signInButton = document.querySelector("#menuSignButton");
const nav_bookingButton = document.querySelector("#menuBookingButton");
const signInContainer = document.querySelector("#signInContainer");
const signUpContainer = document.querySelector("#signUpContainer");
const closeIcon = document.querySelectorAll(".sign__close-icon");
const switchTosignUp = document.querySelector(".switch-to-signUp");
const switchTosignIn = document.querySelector(".switch-to-signIn");
const blackScreen = document.querySelector(".black-screen");

let signUpName = document.querySelector("#signUpName");
let signUpEmail = document.querySelector("#signUpEmail");
let signUpPassword = document.querySelector("#signUpPassword");
const signUpButton = document.querySelector("#signUpButton");

let signInEmail = document.querySelector("#signInEmail");
let signInPassword = document.querySelector("#signInPassword");
const signInButton = document.querySelector("#signInButton");

//   登入框、註冊框上的所有按鈕效果
closeIcon.forEach((e) => {
    e.addEventListener("click",() => {
        signinInfoClear();
        signupInfoClear();
        signInContainer.style.display = "none";
        signUpContainer.style.display = "none";
        blackScreen.style.display = "none";
    })
})
switchTosignUp.addEventListener("click", () => {
    signinInfoClear();
    signUpContainer.style.display = "block";
    signInContainer.style.display = "none";
})
switchTosignIn.addEventListener("click", () => {
    signupInfoClear();
    signUpContainer.style.display = "none";
    signInContainer.style.display = "block";
})

let signupInfoClear = () => {
    signUpName.value = "";
    signUpEmail.value = "";
    signUpPassword.value = "";
    signUpName.style.border = "";
    signUpEmail.style.border = "";
    signUpPassword.style.border = "";
    upNameError.style.display = "none";
    upEmailError.style.display = "none";
    upPasswordError.style.display = "none";
}
let signinInfoClear = () => {
    signInEmail.value = "";
    signInPassword.value = "";
    signInEmail.style.border = "";
    signInPassword.style.border = "";
    inEmailError.style.display = "none";
    inPasswordError.style.display = "none";
}

//   未登入狀態 - NAVBAR上的按鈕
nav_signInButton.addEventListener("click",() => { outOfService()});
nav_bookingButton.addEventListener("click", () => { outOfService()});

function outOfService(){
    if (document.cookie == ""){
        signInContainer.style.display = "block";
        blackScreen.style.display = "block";
    }
}

//   登入狀態
nav_bookingButton.addEventListener("click",() => {
    if(document.cookie != ""){
        document.location.href = "/booking";
    }
})

// --- SIGN_UP  --------------------------------------------------
// 密碼可見
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

// reg
const regEmail = new RegExp("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
const regPassword = new RegExp("\\w{4,19}");

function errorMessage(input, element, message){
    input.style.outline = "none";
    input.style.border = "2px solid red";
    element.style.display = "block";
    element.textContent = message;
}

// 註冊資訊 - 正則表達式
let upNameError = document.querySelector("#signUpNameError");
let upEmailError = document.querySelector("#signUpEmailError");
let upPasswordError = document.querySelector("#signInPasswordError");

signUpName.addEventListener("input", () => {
    if (signUpName.value == ""){
        errorMessage(signUpName, upNameError, "此欄位必填")
    }
    else{
        signUpName.style.border = "";
        upNameError.style.display = "none";
    }
})

signUpEmail.addEventListener("input", () => {
    if (signUpEmail.value == ""){
        errorMessage(signUpEmail, upEmailError, "此欄位必填")
    }
    else if(!regEmail.test(signUpEmail.value)) {
        errorMessage(signUpEmail, upEmailError, "格式有誤，請重新輸入")
    }
    else{
        signUpEmail.style.border = "";
        upEmailError.style.display = "none";
    }
})

signUpPassword.addEventListener("input", () => {
    if (signUpPassword.value == ""){
        errorMessage(signUpPassword, upPasswordError, "此欄位必填");
    }
    else if(!regPassword.test(signUpPassword.value)) {
        errorMessage(signUpPassword, upPasswordError, "密碼長度最短不得低於4碼");
    }
    else{
        signUpPassword.style.border = "";
        upPasswordError.style.display = "none";
    }
})


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
            upPasswordError.style.display = "block";
            upPasswordError.style.color = "#66AABB";
            upPasswordError.textContent = data.message;
        }
        upPasswordError.style.display = "block";
        upPasswordError.textContent = data.message;
    })
}


// --- SIGN_IN -----------------------------------------------------
// 登入資訊 - 正則表達式
let inEmailError = document.querySelector("#signInEmailError");
let inPasswordError = document.querySelector("#signInPasswordError");

signInEmail.addEventListener("input", () => {
    if (signInEmail.value == ""){
        errorMessage(signInEmail, inEmailError, "此欄位必填")
    }
    else if(!regEmail.test(signInEmail.value)) {
        errorMessage(signInEmail, inEmailError, "格式有誤，請重新輸入")
    }
    else{
        signInEmail.style.border = "";
        inEmailError.style.display = "none";
    }
})

signInPassword.addEventListener("input", () => {
    if (signInPassword.value == ""){
        errorMessage(signInPassword, inPasswordError, "此欄位必填");
    }
    else{
        signInPassword.style.border = "";
        inPasswordError.style.display = "none";
    }
})

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
            location.reload();  // 登入成功，重新載入
        }
        inPasswordError.style.display = "block";
        inPasswordError.textContent = data.message;
    })
}


// --- CONTAIN LOGIN STATUS ---------------------------------------
window.addEventListener("load", () =>{
    fetch("/api/user/auth",{
        method: "GET",
        headers: {'Content-type':'application/json'}
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.data !== null){
            nav_signInButton.innerHTML = "登出系統";
        }
        return
    })
})


// --- SINGN_OUT ------------------------------------------------------
nav_signInButton.addEventListener("click",() =>{
    if(document.cookie != ""){
        fetch("/api/user/auth",{
            method: "DELETE",
            headers: {'Content-type':'application/json'}
        })
        .then(response => {
            return response.json()
        }).then(data => {
            if(data.ok == true){
                window.location.reload();  // 登出成功，畫面重載
            }
        })
    }
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