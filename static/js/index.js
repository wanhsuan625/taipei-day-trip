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

let nextpage = 0;
async function fetchAttraction(){
    let attractionAPI = await fetch(`http://54.199.123.84:3000/api/attractions?page=${nextpage}`);
    let attractionData = await attractionAPI.json();
    getAttraction(attractionData);
    nextpage = attractionData.nextPage;
};
fetchAttraction();

// Intersection Observer 設定
const footer = document.querySelector("footer");
const options = {
    root : null,
    rootMargin : "0px",
    threshold : 1
};
let callback = (entries) => {
    entries.forEach(entry => {
        console.log(entry.isIntersecting);
        if (entry.isIntersecting){
            if(nextpage != null){
                fetchAttraction();
            }
        }
    })
};
let observer = new IntersectionObserver(callback, options);
observer.observe(footer);

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
    let categoryAPI = await fetch("http://54.199.123.84:3000/api/categories");
    let categoryData = await categoryAPI.json();
    getCategory(categoryData);
};
fetchCategory();

// 點擊 searchinput - 景點分類框的呈現
const searchInput = document.querySelector(".searchInput");
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



