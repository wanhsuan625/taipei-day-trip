// --- CHECK LOGIN STATEMENT -------------------------------


// --- CREDIT CARD -----------------------------------------
let cleaveCreditNumber = new Cleave("#creditNumber", {
    creditCard: true,
    delimiter: " ",
});
let cleaveExpire = new Cleave("#creditExpire", {
    date: true,
    datePattern: ["m", "y"],
});
