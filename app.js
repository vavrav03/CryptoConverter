const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", "views");

let currencies;

axios
   .get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
   .then((response) => {
      currencies = response.data;
   });

app.get("/", (req, res) => {
   let currencyString = "";
   for (const currency of currencies) {
      currencyString += `<option value="${currency}">${currency.toUpperCase()}</option>`;
   }
   res.render("index", { currencyString });
});

app.listen(3000);
