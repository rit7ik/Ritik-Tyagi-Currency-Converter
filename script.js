const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const inputAmount = document.querySelector("#amount-input");
const fromCurr = document.querySelector('select[name="from_currency"]');
const toCurr = document.querySelector('select[name="to_currency"]');
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector("#swap-icon");

for (let select of dropdowns) {
    for (currCode in countryList) { 
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        
        if (select.name === "from_currency" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to_currency" && currCode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", () => {
        updateFlag(select);
        updateExchangeRate();
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
    img.alt = `Flag of ${currCode}`;
};

const updateExchangeRate = () => {
    let amtVal = inputAmount.value;
    
    if (amtVal === "" || amtVal < 1 || isNaN(amtVal)) {
        amtVal = 1;
        inputAmount.value = "1";
    }

    btn.disabled = true;
    msg.innerText = "Calculating rate...";
    msg.classList.add('loading-msg');
    msg.classList.remove('error-msg'); 

    try {
        const fromCode = fromCurr.value;
        const toCode = toCurr.value;
        let rate;

        const rateTo = staticExchangeRates[toCode];
        const rateFrom = staticExchangeRates[fromCode];
        
        if (rateTo === undefined || rateFrom === undefined) {
             throw new Error("Rate is missing for one of the selected currencies.");
        }
        
        if (fromCode === toCode) {
            rate = 1; 
        } else {
            rate = rateTo / rateFrom;
        }

        let finalAmount = (amtVal * rate).toFixed(2); 
        msg.innerText = `${amtVal} ${fromCode} = ${finalAmount} ${toCode} (Static Rate)`;

    } catch (error) {
        console.error("Calculation Error:", error);
        
        msg.innerText = `Error: ${error.message}`;
        msg.classList.add('error-msg');
        
    } finally {
        btn.disabled = false;
        msg.classList.remove('loading-msg');
    }
};

const swapCurrencies = () => {
    let tempCode = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCode;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

if (swapIcon) {
    swapIcon.addEventListener("click", swapCurrencies);
}

inputAmount.addEventListener("change", updateExchangeRate);
inputAmount.addEventListener("keyup", updateExchangeRate); 


window.addEventListener("load", () => {
    updateFlag(fromCurr); 
    updateFlag(toCurr);
    updateExchangeRate(); 
});