const main = document.querySelector("main");
const search_input = document.querySelector(".search_input");
const button = document.querySelector("button");
let nextpage;
let keyword;

let isLoading = false;

// --- INITIAL PAGE ----------------------------------------
fetchAttraction(0, "");
fetchCategory();

// --- Create main content of Homepage ---------------------
function getAttraction(data){
    let result = data.data;
    console.log(data);

    for(let i = 0; i < result.length; i++){
        let attraction = document.createElement("a");
        attraction.id = "attraction";
        attraction.href = `/attraction/${result[i].id}`;
        main.appendChild(attraction);


        let img_box = document.createElement("div");
        img_box.id = "img_box";
        attraction.appendChild(img_box);
        // images
        let img = document.createElement("img");
        img.setAttribute("src",result[i].images[0]);
        img_box.appendChild(img);
        // attraction name
        let name = document.createElement("div");
        name.id = "name";
        name.textContent = result[i].name;
        name.title = result[i].name;
        img_box.appendChild(name);


        let info_box = document.createElement("div");
        info_box.id = "info_box";
        attraction.appendChild(info_box);
        // mrt
        let mrt = document.createElement("div");
        mrt.textContent = result[i].mrt;
        info_box.appendChild(mrt);
        // categories
        let category = document.createElement("div");
        category.textContent = result[i].category;
        info_box.appendChild(category);
    }
};

async function fetchAttraction(page, keyword){
    isLoading = true;

    let attractionAPI = await fetch(`/api/attractions?page=${page}&keyword=${keyword}`);
    let attractionData = await attractionAPI.json();
    if(attractionData.data.length === 0){
        main.innerHTML = "查無此景點";
    }
    getAttraction(attractionData);
    nextpage = attractionData.nextPage;

    isLoading = false;
};

// --- Intersection Observer -------------------------------
const options = {
    root : null,
    rootMargin : "50px",
    threshold : 1
};
let callback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting){
            if(nextpage != null && isLoading == false){
                if(!keyword){
                    fetchAttraction(nextpage,"");
                }else{
                    fetchAttraction(nextpage,keyword);
                }
            }
        }
    })
};
let observer = new IntersectionObserver(callback, options);
const footer = document.querySelector("footer");
observer.observe(footer);

// --- Get value of KEYWORD --------------------------------
button.addEventListener("click",() => {
    keyword = search_input.value;
    search_input.value = "";
    main.innerHTML = "";           // 清除畫面
    fetchAttraction(0,keyword);
})

// --- Create Categories Box DOM -----------------------------------
const category_box = document.querySelector(".category_box");
function getCategory(data){
    let result = data.data;

    for(let i = 0; i < result.length; i++){
        let category = document.createElement("div");
        category.className = "category";
        category.textContent = result[i];
        category_box.appendChild(category);
    }
};
async function fetchCategory(){
    isLoading = true;

    let categoryAPI = await fetch("/api/categories");
    let categoryData = await categoryAPI.json();
    getCategory(categoryData);

    isLoading = false;
};

// --- Categories Box : CLICK effect -----------------------------------
search_input.addEventListener("click",() => {
    category_box.style.display = "grid";
    
    let category = document.querySelectorAll(".category");
    for(let i = 0; i < category.length; i++){
        category[i].addEventListener("click",() => {
            search_input.value = category[i].innerHTML;
        })
    }
})
window.addEventListener("mouseup",() => {category_box.style.display = "none";})