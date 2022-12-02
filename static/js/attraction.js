let isLoading = false;

// CREATE DOM
const imgSize = document.querySelector(".imgSize");
const infoBox = document.querySelector(".infoBox");
const bookingForm = document.querySelector(".bookingForm");
const main = document.querySelector("main");
const address = document.querySelector(".address");
const transport = document.querySelector(".transport");

let eachAttraction = (data) =>{
    let result = data.data;
    let len = result.images.length;
    // 待修正
    // IMAGES
    let img = document.createElement("img");
    img.className = "attractionImg";
    img.src = result.images[0];
    imgSize.appendChild(img);

    // ATTRACTION - NAME , MRT AND CATEGORY
    let name = document.createElement("h1");
    name.textContent = result.name;
    infoBox.insertBefore(name, bookingForm);
    
    let site = document.createElement("p");
    site.textContent = result.category + " at " + result.mrt;
    infoBox.insertBefore(site, bookingForm);

    // INFORMATION
    let content1 = document.createElement("div");
    content1.textContent = result.description;
    main.insertBefore(content1, address);

    let content2 = document.createElement("div");
    content2.textContent = result.address;
    main.insertBefore(content2, transport);

    let content3 = document.createElement("div");
    content3.textContent = result.transport;
    main.appendChild(content3);
}

async function eachAttractionFetch(num){
    isLoading = true;

    let eachAPI = await fetch(`http://54.199.123.84:3000/api/attraction/${num}`);
    let eachData = await eachAPI.json();
    console.log(eachData); 
    eachAttraction(eachData);   

    isLoading = false;
}
eachAttractionFetch(4);