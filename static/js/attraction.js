// WEBSITE ADDRESS
// let url = location.pathname.split("/")[2];
let eachAttractionFetch = (num) => {
    fetch(`http://54.199.123.84:3000/api/attraction/${num}`)
    .then(response => {
        return response.json();})
    .then(data => {
        console.log(data);
        attractionImg(data);
        attractionInformation(data);
    })
}
eachAttractionFetch(10);


// --- CREATE DOM ---
const title = document.querySelector("head title");
const imgBox = document.querySelector(".imgBox");
const arrow = document.querySelector(".arrow");
const infoBox = document.querySelector(".infoBox");
const bookingForm = document.querySelector(".bookingForm");
const main = document.querySelector("main");
const address = document.querySelector(".address");
const transport = document.querySelector(".transport");

let attractionImg = (data) =>{
    let result = data.data;
    let len = result.images.length;

    // WEBSITE NAME
    title.innerHTML = result.name;
    
    // IMAGES
    for(let i = 0; i < len; i++){
        let imgSlide = document.createElement("div");
        imgSlide.className = "imgSlide fade";
        imgBox.insertBefore(imgSlide, arrow);

        let img = document.createElement("img");
        img.className = "attractionImg";
        img.src = result.images[i];
        imgSlide.appendChild(img);
    }

     // BOTTOM DOT
     let dotGroup = document.createElement("div");
     dotGroup.className = "dotGroup";
     imgBox.appendChild(dotGroup);
     for(let i = 0; i < len; i++){
         let dot = dotGroup.appendChild(document.createElement("div"));
         dot.className = "dot";
         dotGroup.appendChild(dot);
     }

    // --- SLIDE IMAGES ---
    let slide = document.querySelectorAll(".imgSlide");
    let dot = document.querySelectorAll(".dot");
    
    let slideIndex = 1;
    slideShow(slideIndex);

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
    let arrowButton = document.querySelectorAll(".arrow img");
    arrowButton[0].addEventListener("click",() => {
        slideShow(slideIndex -= 1);
    })
    arrowButton[1].addEventListener("click",() => {
        slideShow(slideIndex += 1);
    })

    // DOT BUTTON
    for(let i = 0; i < dot.length; i++){
        dot[i].addEventListener("click", () =>{
            slideShow(slideIndex = i+1);
        })
    }
}

// INTRODUCTION
let attractionInformation = (data) =>{
    let result = data.data;

    // NAME , MRT AND CATEGORY
    let name = document.createElement("h1");
    name.innerHTML = result.name;
    infoBox.insertBefore(name, bookingForm);
    
    let site = document.createElement("p");
    site.innerHTML = result.category + " at " + result.mrt;
    infoBox.insertBefore(site, bookingForm);

    // INFORMATION
    let content1 = document.createElement("div");
    content1.innerHTML = result.description;
    main.insertBefore(content1, address);

    let content2 = document.createElement("div");
    content2.innerHTML = result.address;
    main.insertBefore(content2, transport);

    let content3 = document.createElement("div");
    content3.innerHTML = result.transport;
    main.appendChild(content3);
}