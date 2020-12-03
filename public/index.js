const cryptocurrencySelect = document.getElementById("cryptocurrency");
const cryptoAmountSelect = document.getElementById("crypto-input");
const otherCurrency = document.getElementById("output-currency");
const otherCurrencyOutput = document.getElementById("output");
const searchCurrencyBar = document.getElementById("search-for-currency");

let fromCryptoCurrency = cryptocurrencySelect.value;
let toCurrency = otherCurrency.value;
let amount = 0;
let currentMultiplier = null;

cryptocurrencySelect.addEventListener("change", (event) => {
   fromCryptoCurrency = event.target.value;
   render(true);
});

cryptoAmountSelect.addEventListener("input", (event) => {
   amount = event.target.value;
   render(false);
});

otherCurrency.addEventListener("change", (event) => {
   toCurrency = event.target.value;
   render(true);
});

async function render(newRequest) {
   const value = await calculateValue(newRequest);
   otherCurrencyOutput.textContent = value;
}

async function calculateValue(newRequest) {
   if (newRequest || currentMultiplier == null) {
      const response = await fetch(
         `https://api.coingecko.com/api/v3/simple/price?ids=${fromCryptoCurrency}&vs_currencies=${toCurrency}`
      );
      const cryptoToCurrencyRatio = await response.json();
      for (const f in cryptoToCurrencyRatio) {
         for (const price in cryptoToCurrencyRatio[f]) {
            currentMultiplier = cryptoToCurrencyRatio[f][price];
         }
      }
   }
   return new Number(amount * currentMultiplier).toFixed(2);
}

calculateValue(true);