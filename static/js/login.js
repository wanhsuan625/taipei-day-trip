// OPEN AND CLOSE SINGIN/SIGNUP BOX
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
closeIcon[0].addEventListener("click",() => {
    signinBox.style.display = "none";
    whole.style.display = "none";
})
closeIcon[1].addEventListener("click",() => {
    signupBox.style.display = "none";
    whole.style.display = "none";
})
signinpButton.addEventListener("click", () => {
    signupBox.style.display = "block";
    signinBox.style.display = "none";
})
signupButton.addEventListener("click", () => {
    signupBox.style.display = "none";
    signinBox.style.display = "block";
})