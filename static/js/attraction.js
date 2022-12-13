// --- WEBSITE ADDRESS ---------------------------------------
let url = location.pathname.split("/")[2];

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
eachAttractionFetch(url);

// --- Create DOM of IMG --------------------------------------
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


// --- Create DOM of Bottom Information --------------------------------------
let attractionInformation = (data) =>{
    let result = data.data;

    // NAME , MRT AND CATEGORY
    let name = document.createElement("h1");
    name.innerHTML = result.name;
    info_box.insertBefore(name, booking_form);
    
    let site = document.createElement("p");
    console.log(result.mrt);
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