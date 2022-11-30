let isLoading = false;

// 初始畫面
fetchAttraction(0, "");
fetchCategory();

// 圖片排版設置
const main = document.querySelector("main");
function getAttraction(data){
    let result = data.data;

    for(let i = 0; i < result.length; i++){
        let attraction = document.createElement("div");
        attraction.id = "attraction";
        main.appendChild(attraction);

        let imgBox = document.createElement("div");
        imgBox.id = "imgBox";
        attraction.appendChild(imgBox);
        // 景點圖片
        let img = document.createElement("img");
        img.setAttribute("src",result[i].images[0]);
        imgBox.appendChild(img);
        // 景點名稱
        let name = document.createElement("div");
        name.id = "name";
        name.textContent = result[i].name;
        imgBox.appendChild(name);

        let infoBox = document.createElement("div");
        infoBox.id = "infoBox";
        attraction.appendChild(infoBox);
        // 捷運站
        let mrt = document.createElement("div");
        mrt.textContent = result[i].mrt;
        infoBox.appendChild(mrt);
        // 景點分類
        let category = document.createElement("div");
        category.textContent = result[i].category;
        infoBox.appendChild(category);
    }
};

let nextpage;
let keyword;
async function fetchAttraction(page, keyword){
    isLoading = true;

    let attractionAPI = await fetch(`http://54.199.123.84:3000/api/attractions?page=${page}&keyword=${keyword}`);
    let attractionData = await attractionAPI.json();
    console.log(attractionData.data);
    if(attractionData.data.length === 0){
        main.innerHTML = "查無此景點";
    }
    getAttraction(attractionData);
    nextpage = attractionData.nextPage;
    console.log(nextpage);
    console.log(keyword);

    isLoading = false;
};

// Intersection Observer 設定
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

// keyword取值
const searchInput = document.querySelector(".searchInput");
let button = document.querySelector("button");
button.addEventListener("click",() => {
    keyword = searchInput.value;
    main.innerHTML = "";           // 清除畫面
    fetchAttraction(0,keyword);
})

// 搜尋框-景點分類
const categoryBox = document.querySelector(".categoryBox");
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

    let categoryAPI = await fetch("http://54.199.123.84:3000/api/categories");
    let categoryData = await categoryAPI.json();
    getCategory(categoryData);

    isLoading = false;
};

// 點擊 searchinput - 景點分類框的呈現
searchInput.addEventListener("click",() => {
    categoryBox.style.display = "grid";
    
    let category = document.querySelectorAll(".category");
    for(let i = 0; i < category.length; i++){
        category[i].addEventListener("click",() => {
            searchInput.setAttribute("value", category[i].innerHTML);
        })
    }
})
window.addEventListener("mouseup",() => {categoryBox.style.display = "none";})



