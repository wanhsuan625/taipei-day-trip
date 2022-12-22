fetchBooking();

// --- CREATE DOM OF BOOKING PAGE -------------------------------------------------------------
const main = document.querySelector("main");
let bookingHeadline = document.createElement("div");
bookingHeadline.className = "booking__headline";
let contactName = document.getElementById("contactName");
let contactEmail = document.getElementById("contactEmail");
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

                            <img class="delete-icon" src="/image/icon_delete.png" alt="">
                        </article>`

    main.insertAdjacentHTML("afterbegin", bookingContent);

    // DELETE ITINERARY
    const deleteIcon = document.querySelector(".delete-icon");
    deleteIcon.addEventListener("click", () => {
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
