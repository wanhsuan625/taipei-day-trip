// --- OPEN AND CLOSE SINGIN/SIGNUP BOX --------------------------------
const navbar_Button = document.querySelector(".list2");
const closeIcon = document.querySelectorAll(".closeIcon");
const signinBox = document.querySelector(".signinBox");
const signupBox = document.querySelector(".signupBox");
const changeToUp = document.querySelector(".signinBox div button");
const changeToIn = document.querySelector(".signupBox div button");
const whole = document.querySelector(".whole")

navbar_Button.addEventListener("click",() => {
    if(navbar_Button.innerHTML == "登入/註冊"){
        signinBox.style.display = "block";
        whole.style.display = "block";
    }
})
closeIcon.forEach((e) => {
    e.addEventListener("click",() => {
        signinBox.style.display = "none";
        signupBox.style.display = "none";
        whole.style.display = "none";
    })
})
changeToUp.addEventListener("click", () => {
    signupBox.style.display = "block";
    signinBox.style.display = "none";
})
changeToIn.addEventListener("click", () => {
    signupBox.style.display = "none";
    signinBox.style.display = "block";
})

// --- SIGN_UP  --------------------------------------------------
let upName = document.querySelector("#signupName");
let upEmail = document.querySelector("#signupEmail");
let upPassword = document.querySelector("#signupPassword");
let upMessage = document.querySelector(".upMessage");
const upButton = document.querySelector(".signupBox label button");

upButton.addEventListener("click",(e) =>{
    fetch("/api/user", {
        method : "POST",
        headers: {'Content-type':'application/json'},
        body : JSON.stringify({
                "name" : upName.value,
                "email" : upEmail.value,
                "password" : upPassword.value})
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.ok == true){
            upMessage.style.display = "block";
            upMessage.style.color = "#66AABB";
            upMessage.textContent = data.message;
        }
        upMessage.style.display = "block";
        upMessage.textContent = data.message;
    })
});


// --- SIGN_IN -----------------------------------------------------
let inEmail = document.querySelector("#signinEmail");
let inPassword = document.querySelector("#signinPassword");
let inMessage = document.querySelector(".inMessage");
const inButton = document.querySelector(".signinBox label button");

inButton.addEventListener("click", ()=> {
    fetch("/api/user/auth",{
        method: "PUT",
        headers: {'Content-type':'application/json'},
        body : JSON.stringify({
                "email" : inEmail.value,
                "password" : inPassword.value})
    }).then(response => {
        return response.json();
    }).then(data =>{
        if(data.ok == true){
            location.reload();  // 登入成功，重新載入
        }
        inMessage.style.display = "block";
        inMessage.textContent = data.message;
    })
})

// --- CONTAIN LOGIN STATUS ---------------------------------------
window.addEventListener("load", () =>{
    fetch("/api/user/auth",{
        method: "GET",
        headers: {'Content-type':'application/json'}
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.data !== null){
            navbar_Button.innerHTML = "登出系統";
        }
        return
    })
})

// --- SINGN_OUT ------------------------------------------------------
navbar_Button.addEventListener("click",() =>{
    if(navbar_Button.innerHTML == "登出系統"){
        fetch("/api/user/auth",{
            method: "DELETE",
            headers: {'Content-type':'application/json'}
        })
        .then(response => {
            return response.json()
        }).then(data => {
            if(data.ok == true){
                window.location.reload();
            }
        })
    }
})