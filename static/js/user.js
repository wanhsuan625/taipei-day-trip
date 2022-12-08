// --- OPEN AND CLOSE SINGIN/SIGNUP BOX --------------------------------
const navbar_Button = document.querySelector(".list2");
const closeIcon = document.querySelectorAll(".closeIcon");
const signinBox = document.querySelector(".signinBox");
const signupBox = document.querySelector(".signupBox");
const signinpButton = document.querySelector(".signinBox div button");
const signupButton = document.querySelector(".signupBox div button");
const whole = document.querySelector(".whole")

navbar_Button.addEventListener("click",() => {
    signinBox.style.display = "block";
    whole.style.display = "block";
})
closeIcon.forEach((e) => {
    e.addEventListener("click",() => {
        signinBox.style.display = "none";
        signupBox.style.display = "none";
        whole.style.display = "none";
    })
})
signinpButton.addEventListener("click", () => {
    signupBox.style.display = "block";
    signinBox.style.display = "none";
})
signupButton.addEventListener("click", () => {
    signupBox.style.display = "none";
    signinBox.style.display = "block";
})

// --- SIGNUP : TAKE USER'S INFORMATION -------------------------
const signupName = document.querySelector("#sinupName");
const signupEmail = document.querySelector("#sinupEmail");
const signupPassword = document.querySelector("#signupPassword");

const emailRegxp = "/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/";



const signupUrl = "/api/user"
let signupData = {
    name: signupName.value,
    email: signupEmail.value,
    password: signupPassword.value
}
signupButton.addEventListener("click",() =>{
    fetch(signupUrl,{
        method : "POST",
        headers:{'Content-type':'application/json; charset = UTF-8'},
        body : JSON.stringify(signupData)
    }).then(response => {
        return response.json()
    }).then(data => {

    })
})

