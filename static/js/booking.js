fetchBooking();

// --- CREATE DOM OF BOOKING PAGE -------------------------------------------------------------
const main = document.querySelector("main");
let bookingHeadline = document.createElement("div");
bookingHeadline.className = "booking__headline";
let contactName = document.getElementById("contactName");
let contactEmail = document.getElementById("contactEmail");
let contactPhone = document.getElementById("contactPhone");
const contactSyncButton = document.querySelector("#contactSync");
const totalPrice = document.querySelector(".confirm__price");
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

    // TOTAL PRICE
    totalPrice.textContent = `總價：新台幣 ${result["price"]} 元`;
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
        
        // Media queries
        // Note that these apply to the iframe, not the root window.
        "@media screen and (max-width: 400px)": {
            "input": { "color": "orange"}
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

