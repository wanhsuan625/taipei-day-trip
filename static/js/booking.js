
// --- CREDIT CARD FORMAT --------------------------------------------
let cleaveCreditNumber = new Cleave("#creditNumber", {
    creditCard: true,
    delimiter: " ",
});
let cleaveExpire = new Cleave("#creditExpire", {
    date: true,
    datePattern: ["m", "y"],
});