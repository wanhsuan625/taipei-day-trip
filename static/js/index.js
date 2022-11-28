
// 圖片排版設置
const main = document.querySelector("main");
function getData(data){
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
        // 種類
        let category = document.createElement("div");
        category.textContent = result[i].category;
        infoBox.appendChild(category);
    }
}

url = "http://54.199.123.84:3000/api/attractions?page=0"
fetch(url).then((response) => {
    console.log(response);
    return response.json();
}).then((data) =>{
    console.log(data.data);
    getData(data);
})