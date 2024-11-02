const inputSlider = document.querySelector('[length-slider]');
const lengthDisplay = document.querySelector('[lenght-number]');
const passwordDisplay = document.querySelector('[dataPasswordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copy-message]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox");
const symbols = '~`!@#$%^&*()_+-={}|[]\:";<>?,./';

// initial values //
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc")
handleSlider();

function handleSlider() {

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // const min = inputSlider.min;
    // const max = inputSlider.max;
    // inputSlider.style.backgroundColor = ( (passwordLength-min)*100/(max-min)) + "% 1rem"
};

function shufflePassword(password) {

    // Fisher-Yates shuffle
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements at indices i and j
        [password[i], password[j]] = [password[j], password[i]];
    }
    
    return password.join('');
    
};

function setIndicator(color) {

    indicator.style.backgroundColor = color;
    // shadow bhi krna h
    // indicator.style.boxShadow = "2px";
};

function getRandomInteger(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function getRandomNumber() {
    return getRandomInteger(0, 9);
};

function getRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
};

function getRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
};

function getRandomSymbol() {

    const index = getRandomInteger(0, symbols.length);
    return symbols.charAt(index);
}

function calcStrength() {

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasLower && hasUpper && (hasNum || hasSymbol) && passwordLength >= 8)
        setIndicator("#0f0");
    else if((hasUpper || hasLower) && (hasNum || hasSymbol) && passwordLength >= 6)
        setIndicator("#ff0");
    else
    setIndicator("#f00");
};

async function copyContent() {

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    // show mssg only for 2 seconds 
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000);

};

function handleCheckboxChange() {

    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // edge case handling 

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
};

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', function (event) {
    passwordLength = event.target.value;
    handleSlider();
});

function copyPassword() {
    if(passwordDisplay.value)
        copyContent();
};

//  generate your password 

generateBtn.addEventListener('click', () => {

    if(checkCount <= 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    //  what need to be added 

    funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(getRandomUppercase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(getRandomLowercase);
    }

    if(numbersCheck.checked){
        funcArr.push(getRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(getRandomSymbol);
    }
    
    // compulsory addition

    for( let i = 0; i < funcArr.length; i++ ){
        password += funcArr[i]();
    }

    // randomly selecting remaining characters

    for( let i = 0; i < passwordLength-funcArr.length; i++ ){
        let ranIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[ranIndex]();
    }

    // shuffle the password that is generated 
    password = shufflePassword(Array.from(password));

    // update to input element;
    passwordDisplay.value = password;

    // update strength
    calcStrength();

});
