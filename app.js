const express = require("express");
const axios = require("axios");
const { resolveInclude } = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
   extended: true
}));

app.set("view engine", "ejs");
app.set("views", "views");

let cryptocurrencies = ["bitcoin", "litecoin", "monero", "digibyte"];
let currencies;

axios
   .get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
   .then((response) => {
      currencies = response.data;
   });

function getPriceInDifferenntCurrency(cryptocurrency, amount, secondCurrency) {
   return axios
      .get(
         `https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrency}&vs_currencies=${secondCurrency}`
      )
      .then((response) => {
         for (const f in response.data) {
            for (const price in response.data[f]) {
               return amount * response.data[f][price];
            }
         }
      });
}

app.use(async (req, res, next) => {
   const firstCurrency = req.body['first-selected'] || 'bitcoin';
   const secondCurrency = req.body['second-selected'] || 'usd';
   let currenciesStringFirst = "";
   let currenciesStringSecond = "";
   let firstAmount = req.body['first-amount'] || 1;
   for (let i = 0; i < cryptocurrencies.length; i++) {
      currenciesStringFirst += `<option ${
         cryptocurrencies[i] === firstCurrency ? "selected" : ""
      } value="${cryptocurrencies[i]}">${cryptocurrencies[i]}</option>`;
   }
   for (let i = 0; i < currencies.length; i++) {
      currenciesStringSecond += `<option ${
         secondCurrency.includes(currencies[i]) ? "selected" : ""
      } value="${currencies[i]}">${currencies[i]}</option>`;
   }
   const secondAmount = await getPriceInDifferenntCurrency(
      firstCurrency,
      firstAmount,
      secondCurrency
   );
   res.render("index", {
      currenciesStringFirst,
      currenciesStringSecond,
      firstAmount,
      secondAmount,
   });
});

app.listen(3000);
