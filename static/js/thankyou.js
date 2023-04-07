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
                    <p class="booking-success__content">亦可至<a class="booking-success__hyperlink" href="/member">會員中心</a>查詢歷史訂單</p>
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