// --- OPEN AND CLOSE SINGIN/SIGNUP BOX --------------------------------
const nav_signInButton = document.querySelector(".list_2");
const nav_bookingButton = document.querySelector(".list_1");
const close_icon = document.querySelectorAll(".close_icon");
const sign_in_box = document.querySelector(".sign_in_box");
const sign_up_box = document.querySelector(".sign_up_box");
const change_to_signup = document.querySelector(".sign_in_box div button");
const change_to_signin = document.querySelector(".sign_up_box div button");
const whole = document.querySelector(".whole")

//   登入框、註冊框上的所有按鈕效果
close_icon.forEach((e) => {
    e.addEventListener("click",() => {
        sign_in_box.style.display = "none";
        sign_up_box.style.display = "none";
        whole.style.display = "none";
    })
})
change_to_signup.addEventListener("click", () => {
    sign_up_box.style.display = "block";
    sign_in_box.style.display = "none";
})
change_to_signin.addEventListener("click", () => {
    sign_up_box.style.display = "none";
    sign_in_box.style.display = "block";
})

//   未登入狀態
nav_signInButton.addEventListener("click",() => {outOfService()})
nav_bookingButton.addEventListener("click", () => {outOfService()})

function outOfService(){
    if (document.cookie == ""){
        sign_in_box.style.display = "block";
        whole.style.display = "block";
    }
}

//   登入狀態
nav_bookingButton.addEventListener("click",() => {
    if(document.cookie != ""){
        document.location.href = "/booking";
    }
})

// --- SIGN_UP  --------------------------------------------------
let sign_up_name = document.querySelector("#sign_up_name");
let sign_up_email = document.querySelector("#sign_up_email");
let sign_up_password = document.querySelector("#sign_up_password");
let sign_up_message = document.querySelector(".sign_up_message");
const sign_up_button = document.querySelector(".sign_up_box label button");

sign_up_button.addEventListener("click",() => {signUpFetch()});

let signUpFetch = () => {
    fetch("/api/user", {
        method : "POST",
        headers: {'Content-type':'application/json'},
        body : JSON.stringify({
                "name" : sign_up_name.value,
                "email" : sign_up_email.value,
                "password" : sign_up_password.value})
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.ok == true){
            sign_up_message.style.display = "block";
            sign_up_message.style.color = "#66AABB";
            sign_up_message.textContent = data.message;
        }
        sign_up_message.style.display = "block";
        sign_up_message.textContent = data.message;
    })
}


// --- SIGN_IN -----------------------------------------------------
let sign_in_email = document.querySelector("#sign_in_email");
let sign_in_password = document.querySelector("#sign_in_password");
let sign_in_message = document.querySelector(".sign_in_message");
const sign_in_button = document.querySelector(".sign_in_box label button");

sign_in_button.addEventListener("click", ()=> {signInFetch()});

let signInFetch = () => {
    fetch("/api/user/auth",{
        method: "PUT",
        headers: {'Content-type':'application/json'},
        body : JSON.stringify({
                "email" : sign_in_email.value,
                "password" : sign_in_password.value})
    }).then(response => {
        return response.json();
    }).then(data =>{
        if(data.ok == true){
            location.reload();  // 登入成功，重新載入
        }
        sign_in_message.style.display = "block";
        sign_in_message.textContent = data.message;
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
let top_button = document.querySelector(".top_button");

window.addEventListener("scroll", () => scrollPage());
top_button.addEventListener("click", () => backTop());

function scrollPage(){
    if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
        top_button.style.display = "block";
    }
    else{
        top_button.style.display = "none";
    }
}
function backTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}