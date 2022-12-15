// --- WEBSITE ADDRESS ---------------------------------------
let attractionID = location.pathname.split("/")[2];

let eachAttractionFetch = (num) => {
    fetch(`/api/attraction/${num}`)
    .then(response => {
        return response.json();})
    .then(data => {
        console.log(data);
        attractionImg(data);
        attractionInformation(data);
    })
}
eachAttractionFetch(attractionID);


// --- CREATE DOM OF IMG --------------------------------------
const title = document.querySelector("head title");
const img_box = document.querySelector(".img_box");
const arrow = document.querySelector(".arrow");
const info_box = document.querySelector(".info_box");
const booking_form = document.querySelector(".booking_form");
const section = document.querySelector("section");
const headline = document.querySelectorAll(".headline");
var slide;
var dot;
var slideIndex;

let attractionImg = (data) =>{
    let result = data.data;
    let len = result.images.length;

    // WEBSITE NAME
    title.innerHTML = result.name;
    
    // IMAGES
    for(let i = 0; i < len; i++){
        let img_slide = document.createElement("div");
        img_slide.className = "img_slide fade";
        img_box.insertBefore(img_slide, arrow);

        let img = document.createElement("img");
        img.className = "attraction_img";
        img.src = result.images[i];
        img_slide.appendChild(img);
    }

     // BOTTOM DOT
     let dot_group = document.createElement("div");
     dot_group.className = "dot_group";
     img_box.appendChild(dot_group);
     for(let i = 0; i < len; i++){
         let dot = dot_group.appendChild(document.createElement("div"));
         dot.className = "dot";
         dot_group.appendChild(dot);
     }

    // SLIDE IMAGES
    slide = document.querySelectorAll(".img_slide");
    dot = document.querySelectorAll(".dot");

    slideIndex = 1;
    slideShow(slideIndex); 

    // DOT BUTTON
    for(let i = 0; i < dot.length; i++){
        dot[i].addEventListener("click", () =>{
            slideShow(slideIndex = i+1);
        })
    }
}

function slideShow(n){
    if (n > slide.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slide.length}
    for (i = 0; i < slide.length; i++) {
        slide[i].style.display = "none";
        dot[i].classList.remove("active");
    }
    slide[slideIndex-1].style.display = "block";
    dot[slideIndex-1].classList.add("active");
}

// ARROW BUTTON
const arrowButton = document.querySelectorAll(".arrow img");
arrowButton[0].addEventListener("click",() => {
    slideShow(slideIndex -= 1);
})
arrowButton[1].addEventListener("click",() => {
    slideShow(slideIndex += 1);
})


// --- LIMIT BOOKING_DATE -----------------------------------------
const bookingDate = document.getElementById("bookingDate");

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
if(month < 10){ month = `0${month}`};
let day = date.getDate();
if(day < 10){ day = `0${day}`};

let today = `${year}-${month}-${day}`;
bookingDate.setAttribute("min", today);   // 不可選過去的時間

//   時段、價格取值
const morning = document.getElementById("morning");
let time;
let price;

function selectTime(){
    if(morning.checked){
        time = "morning";
        price = "2000";}
    else{
        time = "afternoon";
        price = "2500";}
}


// --- BOOKING ITINERARY BUTTON -----------------------------------------------
const itineraryButton = document.querySelector(".booking_form button");
const errorMessage = document.querySelector(".error_message");

itineraryButton.addEventListener("click", () => {
    if(document.cookie == ""){
        sign_in_box.style.display = "block";
        whole.style.display = "block";
    }
    else{
        if(bookingDate.value == ""){
            bookingDate.style.border = "2px solid red";
            bookingDate.style.borderRadius = "5px";
            errorMessage.style.display = "inline";
        }
        // ****若有登入&day有值，則傳送資料給booking page***
        else{
            bookingPostFetch();
        }
    }   
})

let bookingPostFetch = () => {
    let selectDay = bookingDate.value;
    selectTime();

    fetch("/api/booking",{
        method: "POST",
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({
            "attractionId": attractionID,
            "date": selectDay,
            "time": time,
            "price": price})
    }).then(response => {
        return response.json()
    }).then(data => {
        if(data.ok == true){
            console.log(data);
            // window.location.href = "/booking";
        }
    })
}


// --- CREATE DOM OF BOTTOM INFORMATION --------------------------------------
let attractionInformation = (data) =>{
    let result = data.data;

    // NAME , MRT AND CATEGORY
    let name = document.createElement("h1");
    name.innerHTML = result.name;
    info_box.insertBefore(name, booking_form);
    
    let site = document.createElement("p");
    if(result.mrt == null){
        site.innerHTML = result.category;}
    else{
        site.innerHTML = result.category + " at " + result.mrt;}
    info_box.insertBefore(site, booking_form);

    // INFORMATION
    let content1 = document.createElement("div");
    content1.innerHTML = result.description;
    section.insertBefore(content1, headline[0]);

    let content2 = document.createElement("div");
    content2.innerHTML = result.address;
    section.insertBefore(content2, headline[1]);

    let content3 = document.createElement("div");
    content3.innerHTML = result.transport;
    section.appendChild(content3);
};