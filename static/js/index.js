const main = document.querySelector("#main");
const searchInput = document.querySelector(".search-box__input");
const searchButton = document.querySelector(".search-box__icon");
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
        attraction.className = "attraction";
        attraction.href = `/attraction/${result[i].id}`;
        main.appendChild(attraction);


        let imgBox = document.createElement("div");
        imgBox.className = "attraction__img-box";
        attraction.appendChild(imgBox);
        // images
        let img = document.createElement("img");
        img.setAttribute("src",result[i].images[0]);
        imgBox.appendChild(img);
        // attraction name
        let name = document.createElement("div");
        name.className = "name";
        name.textContent = result[i].name;
        name.title = result[i].name;
        imgBox.appendChild(name);


        let infoBox = document.createElement("div");
        infoBox.className = "attraction__info-box";
        attraction.appendChild(infoBox);
        // mrt
        let mrt = document.createElement("div");
        mrt.textContent = result[i].mrt;
        infoBox.appendChild(mrt);
        // categories
        let category = document.createElement("div");
        category.textContent = result[i].category;
        infoBox.appendChild(category);
    }
};

async function fetchAttraction(page, keyword){
    isLoading = true;

    let attractionAPI = await fetch(`/api/attractions?page=${page}&keyword=${keyword}`);
    let attractionData = await attractionAPI.json();
    if(attractionData.data.length === 0){
        main.classList.remove("main");
        main.classList.add("no-search");

        const noSearchIcon = `<img src="/image/no-location.png">
                              <div class="no-search__content">查無此景點</div>`;
        main.insertAdjacentHTML("afterbegin", noSearchIcon);
    }
    else{
        main.classList.add("main");
        main.classList.remove("no-search");

        getAttraction(attractionData);
        nextpage = attractionData.nextPage;
    }

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
searchButton.addEventListener("click",() => {
    keyword = searchInput.value;
    searchInput.value = "";
    main.innerHTML = "";           // 清除畫面
    fetchAttraction(0,keyword);
})

// --- Create Categories Box DOM -----------------------------------
const categoryBox = document.querySelector(".category-box");
function getCategory(data){
    let result = data.data;

    for(let i = 0; i < result.length; i++){
        let category = document.createElement("div");
        category.className = "category";
        category.textContent = result[i];
        categoryBox.appendChild(category);
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
searchInput.addEventListener("click",() => {
    categoryBox.style.display = "grid";
    
    let category = document.querySelectorAll(".category");
    for(let i = 0; i < category.length; i++){
        category[i].addEventListener("click",() => {
            searchInput.value = category[i].innerHTML;
        })
    }
})
window.addEventListener("mouseup",() => {categoryBox.style.display = "none";})