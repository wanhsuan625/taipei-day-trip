fetchBooking();

// --- CREATE DOM OF BOOKING PAGE -------------------------------------------------------------
const main = document.querySelector("main");
let bookingHeadline = document.createElement("div");
bookingHeadline.className = "booking__headline";

const contactSyncButton = document.querySelector("#contactSync");
let contactName = document.querySelector("#contactName");
let contactNameError = document.querySelector("#contactNameError");
let contactEmail = document.querySelector("#contactEmail");
let contactEmailError = document.querySelector("#contactEmailError");
let contactPhone = document.querySelector("#contactPhone");
let contactPhoneError = document.querySelector("#contactPhoneError");

let creditCardError = document.querySelector("#creditCardError");
const confirmPrice = document.querySelector(".confirm__price");
const confirmButton = document.querySelector(".confirm__button");
const footer = document.querySelector("footer");

const failPay = document.querySelector(".failPay-container");
const failPay_home = document.querySelector(".to-home");
const failPay_booking = document.querySelector(".to-booking");

// --- ORDER VARIABLE -------------------------------------------------------------------------
let orderId;
let orderName;
let orderAddress;
let orderImage;
let orderDate;
let orderTime;
let orderPrice;

// USER INFORMATION
fetch("/api/user/auth")
.then(response => {return response.json();})
.then(data => {
    let result_user = data.data;
    bookingHeadline.textContent = `您好，${result_user.name}，待預約的行程如下：`;
    main.insertAdjacentElement("beforebegin", bookingHeadline);

    // CONTACT AREA - USER'S INFORMATION
    contactSyncButton.addEventListener("click", () => {
        if(contactSyncButton.checked){
            contactName.value = result_user.name;
            contactName.style.color = "#448899";
            contactEmail.value = result_user.email;
            contactEmail.style.color = "#448899";
        }
        else{
            contactName.value = "";
            contactEmail.value = "";
        }
    })
})

// ITINERARY AREA
async function fetchBooking(){
    let bookingData = await fetch("/api/booking").then(response => {return response.json()});

    if(bookingData.data == null){
        DOMof_No_Booking();}
    else{
        DOMofBooking(bookingData);}
}

let DOMof_No_Booking = () => {
    main.innerHTML = "";
    
    let no_booking_container = document.createElement("article");
    no_booking_container.className = "no_booking-container";
    main.appendChild(no_booking_container);

    let empty_cart_img = document.createElement("img");
    empty_cart_img.src = "/image/empty-cart.png";
    empty_cart_img.style = "margin-bottom: 15px";
    no_booking_container.appendChild(empty_cart_img);

    let no_booking_text = document.createElement("div");
    no_booking_text.className = "no-booking";
    no_booking_text.textContent = "目前沒有任何待預定的行程";
    no_booking_container.appendChild(no_booking_text);
    
    
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

    footer.style.paddingTop = "50px";
    footer.style.paddingBottom = "20%";
}

let DOMofBooking = (data) => {
    let result = data.data;
    let result_attraction = data.data.attraction;

    let time;
    if(result["time"] == "morning"){
        time = "早上8點至下午1點";
    }
    else{
        time = "下午1點至晚上6點";
    }

    let bookingContent = `<article class="booking-container">
                            <img class="booking__img" src=${result_attraction["image"]} ,alt="">

                            <section class="booking__info-box">
                                <h1>台北一日遊：${result_attraction["name"]}</h1>
                                <div class="booking__detail"><span>日期：</span>${result["date"]}</div>
                                <div class="booking__detail"><span>時間：</span>${time}</div>
                                <div class="booking__detail"><span>費用：</span>新台幣 ${result["price"]}元</div>
                                <div class="booking__detail"><span>地點：</span>${result_attraction["address"]}</div>
                            </section>

                            <img class="booking__delete-icon" src="/image/icon_delete.png" alt="">
                            <div class="booking__delete-container">
                                <div class="delete__titel">確定取消此行程？</div>
                                <div class="delete__button-box">
                                    <button class="delete__button delete-yes">是</button>
                                    <button class="delete__button delete-no">否</button>
                                </div>
                            </div>
                        </article>`

    main.insertAdjacentHTML("afterbegin", bookingContent);
    
    // TOTAL PRICE
    confirmPrice.textContent = `總價：新台幣 ${result["price"]} 元`;
    
    // DELETE ITINERARY
    // 確認是否刪除    
    const deleteIcon = document.querySelector(".booking__delete-icon");
    const deleteContainer = document.querySelector(".booking__delete-container");
    const deleteYes = document.querySelector(".delete-yes");
    const deleteNo = document.querySelector(".delete-no");
    const bookingContainer = document.querySelector(".booking-container")

    deleteIcon.addEventListener("click", () => {
        deleteContainer.style.display = "block";
        bookingContainer.classList.add("black-background");        
    })

    // 不取消行程
    deleteNo.addEventListener("click", () => {
        deleteContainer.style.display = "none";
        bookingContainer.classList.remove("black-background");
    })
    // 取消行程
    deleteYes.addEventListener("click", () => {
        fetchDeletItinerary();
        location.reload();
    })

    // 訂單取資料
    orderId = result_attraction["id"];
    orderName = result_attraction["name"];
    orderAddress = result_attraction["address"];
    orderImage = result_attraction["image"];
    orderDate = result["date"];
    orderTime = result["time"];
    orderPrice = result["price"];
}

let fetchDeletItinerary = () => {
    fetch("/api/booking",{
        method: "DELETE",
        headers: {'Content-type': 'application/json'}
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data.ok == "true") {
            DOMof_No_Booking();
        }
        return
    })
}


// --- VALIDITY CONTACT INFORMATION ----------------------------------------------------------------
const regPhone = new RegExp("((?=(09))[0-9]{10})$");

function invalid(input, element, message){
    input.classList.add("invalid");
    element.style.display = "block";
    element.textContent = message;
}
function valid(input, element){
    input.classList.remove("invalid");
    input.classList.add("valid");
    element.style.display = "none";
}

contactName.addEventListener("change", () => {
    if (contactName.value == ""){
        invalid(contactName, contactNameError, "⚠ 此欄必填");
    }
    else {
        valid(contactName, contactNameError);
    }
})

contactEmail.addEventListener("change", () =>{
    if (contactEmail.value == ""){
        invalid(contactEmail, contactEmailError, "⚠ 此欄必填");
    }
    else if(!regEmail.test(contactEmail.value)) {
        invalid(contactEmail, contactEmailError, "⚠ 格式有誤，請重新輸入");
    }
    else{
        valid(contactEmail, contactEmailError);
    }
})

contactPhone.addEventListener("change", () =>{
    if (contactPhone.value == ""){
        invalid(contactPhone, contactPhoneError, "⚠ 此欄必填");
    }
    else if(!regPhone.test(contactPhone.value)) {
        invalid(contactPhone, contactPhoneError, "⚠ 格式有誤，請重新輸入");
    }
    else{
        valid(contactPhone, contactPhoneError);
    }
})


// --- CREDIT CARD ------------------------------------------------------------------------
TPDirect.setupSDK(
    126971,
    "app_bmhD4ubStRHqvzB6Q2RZ9xUJV3hXSwyLrgsMAhV234DQRhdqSwQKGfSc6nzR",
    "sandbox"
)

let fields = {
    number: {
        element: "#card-number",
        placeholder: "**** **** **** ****"
    },
    expirationDate: {
        element: "#card-expiration-date",
        placeholder: "MM / YY"
    },
    ccv: {
        element: "#card-ccv",
        placeholder: "ccv"
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        "input": {
            "color": "gray",
            "font-size": "16px",
        },
        ":focus": { "color": "#666666"},
        ".valid": { "color": "#448899"},
        '.invalid': { "color": "red"},
    },

    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})


confirmButton.addEventListener("click", () => {
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    if (contactName.value != "" && contactEmail.value != "" && contactPhone.value != ""){
        // 確認是否可以 getPrime
        if (tappayStatus.canGetPrime === false) {
            creditCardError.style.display = "block";
            creditCardError.textContent = "⚠ 信用卡資料有誤，請重新填寫";
            return
        }
    }else{
        if(contactName.value == ""){
            invalid(contactName, contactNameError, "⚠ 此欄必填");}
        if(contactEmail.value == ""){
            invalid(contactEmail, contactEmailError, "⚠ 此欄必填");}
        if(contactPhone.value == ""){
            invalid(contactPhone, contactPhoneError, "⚠ 此欄必填");}       
        return
    }
    
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            failPay.style.display = "block";
            blackScreen.style.display = "block";
            return
        }
        prime = result.card.prime;

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api

        fetch("/api/orders",{
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                    "prime": prime,
                    "order": {
                        "price": orderPrice,
                        "trip": {
                            "attraction": {
                                "id": orderId,
                                "name": orderName,
                                "address": orderAddress,
                                "image": orderImage
                            },
                            "date": orderDate,
                            "time": orderTime
                        },
                        "contact": {
                            "name": contactName.value,
                            "email": contactEmail.value,
                            "phone": contactPhone.value
                        }
                    }
                })
        }).then(response => {
            return response.json()
        }).then((data) => {
            if (data.data.payment.status == 0) {
                window.location.href = `/thankyou?number=${data.data.number}`;
            }
            else{
                failPay.style.display = "block";
                return
            }
        })
    })
    
    const confirmText = document.querySelector(".confirm__text");
    confirmText.style.display = "block";
})


// --- FAIL TO BOOKING ------------------------------------------------------------------------
failPay_home.addEventListener("click", () => {
    window.location.href = "/";
})
failPay_booking.addEventListener("click", () => {
    window.location.href = "/booking";
})