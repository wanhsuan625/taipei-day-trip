//  --- EMBED GOOGLE MAP --------------------------------------------
const head = document.querySelector("head");
const map_script = document.createElement("script");
const map_src = `https://maps.googleapis.com/maps/api/js?key=${map_key}&callback=initMap`;

map_script.src = map_src;
map_script.async = true;
map_script.defer = true;
map_script.type = "text/javascript";
head.appendChild( map_script );

// --- WEBSITE ADDRESS ---------------------------------------
let attractionID = location.pathname.split("/")[2];

let eachAttractionFetch = (num) => {
    fetch(`/api/attraction/${num}`)
    .then(response => {
        return response.json();})
    .then(data => {
        function initMap(){
            var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 17,
                center: {lat : data.data.lat, lng: data.data.lng },
            });
            var marker = new google.maps.Marker({
                position: {lat : data.data.lat, lng: data.data.lng },
                map: map,
            });
        }
        window.onload = initMap;

        attractionImg(data);
        attractionInformation(data);
    })
}
eachAttractionFetch(attractionID);

// --- CREATE DOM OF IMG --------------------------------------
const title = document.querySelector("head title");
const imgBox = document.querySelector(".img-box");
const imgBlur = document.querySelector(".img-background-blur");
const arrow = document.querySelector(".arrow");
const infoBox = document.querySelector(".info-box");
const bookingForm = document.querySelector(".booking-form");
const section = document.querySelector("section");
const headline = document.querySelectorAll(".section__headline");
const map = document.getElementById("map");
var slide;
var dot;
var slideIndex;

let attractionImg = (data) =>{
    let result = data.data;
    let len = result.images.length;

    // WEBSITE NAME
    title.innerHTML = result.name;
    
    // IMAGES
    let loaded_images = 0;
    let loader = document.querySelector("#loader");
    let img_loading_percent = document.querySelector(".img-loading-percent");

    for( let i = 0 ; i < len ; i++ ){
        let imgSlide = document.createElement("div");
        imgSlide.className = "img-slide";
        imgBox.insertBefore(imgSlide, arrow);

        let img = document.createElement("img");
        img.className= "attraction-img";
        img.loading = "eager";
        img.src = result.images[i];

        // loading images
        img.onload = function () {
            loaded_images++ ;
            if ( loaded_images == len){
                img_loading_percent.textContent = "100%";
                
                // loading devoration fade out
                imgBlur.classList.add("fadeOut");
                loader.classList.add("fadeOut");
                img_loading_percent.classList.add("fadeOut");

                setTimeout( ()=> {
                    loader.style.display = "none";
                    imgBlur.style.display = "none";
                    img_loading_percent.style.display = "none";
                }, 2000);
            }
            else{
                let number_loading_percent =  Math.floor(100 * loaded_images / len ) + "%" ;
                img_loading_percent.textContent = number_loading_percent;
            }
        }

        // showing image
        imgSlide.appendChild(img);
    }

     // BOTTOM DOT
     let dotGroup = document.createElement("div");
     dotGroup.className = "dot-group";
     imgBox.appendChild(dotGroup);
     for(let i = 0; i < len; i++){
         let dot = dotGroup.appendChild(document.createElement("div"));
         dot.className = "dot";
         dotGroup.appendChild(dot);
     }

    // SLIDE IMAGES
    slide = document.querySelectorAll(".img-slide");
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
const arrowButton = document.querySelectorAll(".arrow__icon");
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
const itineraryButton = document.querySelector(".booking-form__button");
const bookingError = document.querySelector(".booking-form__error-message");

itineraryButton.addEventListener("click", () => {
    if(document.cookie == ""){
    signInContainer.style.display = "block";
    blackScreen.style.display = "block"; }
    else{
        if(bookingDate.value == ""){
            bookingDate.style.border = "2px solid red";
            bookingDate.style.borderRadius = "5px";
            bookingError.style.display = "inline";
        }
        else{ bookingPostFetch();}
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
            window.location.href = "/booking";}
    })
}


// --- CREATE DOM OF BOTTOM INFORMATION --------------------------------------
let attractionInformation = (data) =>{
    let result = data.data;

    // NAME , MRT AND CATEGORY
    let name = document.createElement("h1");
    name.className = "info-box__headline";
    name.innerHTML = result.name;
    infoBox.insertBefore(name, bookingForm);
    
    let site = document.createElement("p");
    site.className = "info-box__sub-headline";
    if(result.mrt == null){
        site.innerHTML = result.category;}
    else{
        site.innerHTML = result.category + " at " + result.mrt;}
    infoBox.insertBefore(site, bookingForm);

    // INFORMATION
    let content1 = document.createElement("div");
    content1.className = "section__content";
    content1.innerHTML = result.description;
    section.insertBefore(content1, headline[0]);

    let content2 = document.createElement("div");
    content2.className = "section__content";
    content2.innerHTML = result.transport;
    section.insertBefore(content2, headline[1]);

    let content3 = document.createElement("div");
    content3.className = "section__content";
    content3.innerHTML = result.address;
    section.insertBefore(content3, map);
};