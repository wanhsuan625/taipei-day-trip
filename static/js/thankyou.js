let urlParams = window.location.search;
orderId = urlParams.split("=")[1];
const main = document.querySelector("main");

fetch(`/api/order/${orderId}`).then((response) => {
    return response.json();
}).then((data) => {
    if (data.data === null){
        DOMof_notFound();}
    else if(data.data != null){
        DOMof_success();}
    else{
        location.href = "/";}
})

function DOMof_success(){
    let success = `<div class="booking-success__container">
                    <div class="booking-success__box">
                        <i class="fa-solid fa-calendar-check booking-success__icon"></i>
                        <h1 class="booking-success__title">訂單完成</h1>
                    </div>
                    <p class="booking-success__content">訂單編號 ─ <span id="orderId">${orderId}</span></p>
                    <p class="booking-success__content">亦可至<a class="booking-success__hyperlink" href="/account/order">會員中心</a>查詢歷史訂單</p>
                </div>`
    main.insertAdjacentHTML("afterbegin", success);
}

function DOMof_notFound(){
    let notFound = `<div class="booking-success__container">
                        <div class="booking-success__box">
                            <i class="fa-solid fa-calendar-xmark booking-success__icon"></i>
                            <h1 class="booking-success__title">無訂單</h1>
                        </div>
                        <p class="booking-success__content">查無此訂單，請再次確認訂單編號</p>
                    </div>`
    main.insertAdjacentHTML("afterbegin", notFound);
}

//  推薦景點
let recommend_attraction_title = 
    '<article class="recommend__container">\
        <h4 class="recommend__title">您可能會有興趣的其他景點：</h4>\
        <div class="recommend__attraction-combination"></div>\
    </article>\
    ';
main.insertAdjacentHTML("afterend", recommend_attraction_title);
const attraction_combination = document.querySelector(".recommend__attraction-combination");

let recommend_number = [];
for ( let i = 0; i < 4 ; i++ ){
    let random = Math.floor( Math.random() * 57 ) + 1 ;

    if ( recommend_number.includes( random ) ){
        recommend_number.push( random + 1 );
        random++ ;
    }else{
        recommend_number.push( random );}
    
    // RECOMMEND ATTRACTION DOM
    const recommend_img_box = document.createElement("div");
    recommend_img_box.className = "recommend__attraction-imgBox";
    attraction_combination.appendChild(recommend_img_box);

    // 景點圖片
    const recommend_img = document.createElement("img");
    recommend_img.className = "recommend__attraction-img";
    recommend_img_box.appendChild(recommend_img);

    // 景點名稱
    const recommend_attraction_name = document.createElement("div");
    recommend_attraction_name.className = "recommend__attraction-name";
    recommend_img_box.appendChild(recommend_attraction_name);
    
    const recommend_attraction_descript = document.createElement("div");
    recommend_attraction_descript.className = "recommend__attraction-descript";

    fetch(`/api/attraction/${random}`)
    .then( response => { return response.json(); })
    .then( data => {
        let result = data.data;
        let attraction_img = result.images[0];
        let attraction_name = result.name;
        let attraction_description = result.description.split("。")[0];

        recommend_img.src = attraction_img;
        recommend_attraction_name.innerText = attraction_name;
        
        recommend_attraction_name.appendChild(recommend_attraction_descript);
        recommend_attraction_descript.textContent = attraction_description;
        // 景點詳述
        // recommend_attraction_name.insertAdjacentText("beforeend", attraction_description);
    })

    // 點選 - 跳轉至該景點頁面
    recommend_img_box.addEventListener("click", () => {
        window.location.href = `/attraction/${random}`;
    })
}