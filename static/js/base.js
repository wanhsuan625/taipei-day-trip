// --- BODY -----------------------------------------------------------------------
const wrapper = document.querySelector(".wrapper");
let navbar = 
    '<header>\
        <nav>\
            <a class="title" href="/">台北一日遊</a>\
            <ul class="menu">\
                <li class="list1">預定行程</li>\
                <li class="list2">登入/註冊</li>\
            </ul>\
        </nav>\
    </header>';

let toTopButoon = 
    '<button class="topButton"><i class="fa-solid fa-angles-up"></i></button>';

wrapper.insertAdjacentHTML("afterbegin", navbar);
wrapper.insertAdjacentHTML("beforeend", toTopButoon);


// --- SETTING toTopButton EFFECT ------------------------------------------------
let topButton = document.querySelector(".topButton");

window.addEventListener("scroll", () => scrollPage());
topButton.addEventListener("click", () => backTop());

function scrollPage(){
    if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
        topButton.style.display = "block";
    }
    else{
        topButton.style.display = "none";
    }
}
function backTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}