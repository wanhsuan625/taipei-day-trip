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

const confirmPrice = document.querySelector(".confirm__price");
const confirmButton = document.querySelector(".confirm__button");
const footer = document.querySelector("footer");

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
            contactEmail.value = result_user.email;
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
        DOMof_NoBooking();
    }
    else{
        DOMofBooking(bookingData);
    }
}

let DOMof_NoBooking = () => {
    main.innerHTML = "";
    let article = document.createElement("article");
    article.className = "booking-container no-booking";
    article.textContent = "目前沒有任何待預定的行程";
    main.appendChild(article);

    footer.style.paddingTop = "50px";
    footer.style.paddingBottom = "100%";
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

    // 不選擇取消
    deleteNo.addEventListener("click", () => {
        deleteContainer.style.display = "none";
        bookingContainer.classList.remove("black-background");
    })
    // 選擇取消
    deleteYes.addEventListener("click", () => {
        fetchDeletItinerary();
        location.reload();
    });

    
}

let fetchDeletItinerary = () => {
    fetch("/api/booking",{
        method: "DELETE",
        headers: {'Content-type': 'application/json'}
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data.ok == "true") {
            DOMof_NoBooking();
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
        invalid(contactName, contactNameError, "此欄必填");
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


confirmButton.addEventListener("click", (event) => {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();



    // 確認是否可以 getPrime
    // if (tappayStatus.canGetPrime === false) {
    //     console.log("can not get prime");
    //     return
    // }

    // Get prime
    // TPDirect.card.getPrime((result) => {
    //     if (result.status !== 0) {
    //         console.log("get prime error " + result.msg);
    //         return
    //     }
    //     console.log("get prime 成功，prime: " + result.card.prime);

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    // })
})

