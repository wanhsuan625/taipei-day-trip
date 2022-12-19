fetchBooking();

// --- CREATE DOM OF BOOKING PAGE -------------------------------------------------------------
const main = document.querySelector("main");
let bookHeadline = document.createElement("div");
bookHeadline.className = "book_headline";
let inputName = document.getElementById("name");
let inputEmail = document.getElementById("email");
const contactSyncButton = document.querySelector("#contactSync");
const totalPrice = document.querySelector(".total_price");
const footer = document.querySelector("footer");

// USER INFORMATION
fetch("/api/user/auth")
.then(response => {return response.json();})
.then(data => {
    let result_user = data.data;
    bookHeadline.textContent = `您好，${result_user.name}，待預約的行程如下：`;
    main.insertAdjacentElement("beforebegin", bookHeadline);

    // CONTACT AREA - USER'S INFORMATION
    contactSyncButton.addEventListener("click", () => {
        if(contactSyncButton.checked){
            inputName.value = result_user.name;
            inputEmail.value = result_user.email;
        }
        else{
            inputName.value = "";
            inputEmail.value = "";
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
    article.className = "book_container nobooking";
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

    let bookingContent = `<article class="book_container">
                            <img class="book_img" src=${result_attraction["image"]} ,alt="">

                            <section class="book_info_container">
                                <h1>台北一日遊：${result_attraction["name"]}</h1>
                                <div class="book_detail"><span>日期：</span>${result["date"]}</div>
                                <div class="book_detail"><span>時間：</span>${time}</div>
                                <div class="book_detail"><span>費用：</span>新台幣 ${result["price"]}元</div>
                                <div class="book_detail"><span>地點：</span>${result_attraction["address"]}</div>
                            </section>

                            <img class="delete_icon" src="/image/icon_delete.png" alt="">
                        </article>`

    main.insertAdjacentHTML("afterbegin", bookingContent);

    // DELETE ITINERARY
    const deleteIcon = document.querySelector(".delete_icon");
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
let cleaveCreditNumber = new Cleave("#creditNumber", {
    creditCard: true,
    delimiter: " ",
});
let cleaveExpire = new Cleave("#creditExpire", {
    date: true,
    datePattern: ["m", "y"],
});
