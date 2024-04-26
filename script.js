//TO-DO:
//1. Full selects with data -----------------------------> ✓ (functions fillSelectElements + fillSelect)
//2. Get all drinks from  API ---------------------------> ✓ (function getAllDrinks)
//3. Drinks displayed -----------------------------------> ✓ (function generateDrinksHTML)
//4. Filtering for drinks (selects) ---------------------> ✓ (function filter)
    //4.1. Filtering: serach by the name ----------------> ✓ (searchValue)
//5. Modal window ---------------------------------------> ✓ (functions openModal/generateModalContent)
//6. Modal window closing -------------------------------> ✓ (functions closeModal/EscapeKey) (esc key+2 buttons+background)
//7. Random coctail with button "Challenge" -------------> ✓ (functions randomCoctail)

const selectValues = {}; console.log(selectValues);  //  object to which 3 fields will be assigned from the "fillSelectElements" function
const drinksArray = []; console.log(drinksArray);

const coctailNameFilterElement = document.querySelector("#coctail-name-filter"),
categorySelectElement = document.querySelector("#category-select"),
glassSelectElement = document.querySelector("#glass-type-select"),
ingredientSelectElement = document.querySelector("#ingredient-select"),

dynamicDrinksElement = document.querySelector(".drinks"),

buttonSearch = document.querySelector ("#search"),
buttonReset = document.querySelector(".butonReset"),
buttonChallenge = document.querySelector("#challenge"),
note = document.querySelector(".note"),
noteOfDrinks = document.querySelector(".noteOfDrinks"),

modalOpen = document.querySelector (".modal-bg"),
modalCloseX = document.querySelector (".modal-close-button-x"),
modalClose = document.querySelector (".modal-close-button"),
modalCloseBackground = document.querySelector (".modal-bg"),

modalImg = document.querySelector (".modal-img"),
modalTitle = document.querySelector (".modal-title"),
modalCategory = document.querySelector ("#modal-category"),
modalAlcohol = document.querySelector ("#modal-alcohol"),
modalGlass = document.querySelector ("#modal-glass"),
modalIngredients = document.querySelector ("#modal-ingredients"),
modalRecipe = document.querySelector ("#modal-recipe"),

alphabetContainer = document.getElementById('alphabet-letters');

async function fillSelectElements (){  //All Fetch processed at the same time (faster processing)
const allUrls = [ //Get all "promise" to one array
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list",
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list", 
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
    ];
    const allPromises = allUrls.map((url) => fetch(url).then((response) => response.json())); //For each url fetch is done + parsing is performed using one array "allUrls" and the map method (gets all links and changes them)
    console.log(allPromises); //receive an array with 3 "completed" promises (but we don't have their values yet)
    const allValues = await Promise.all(allPromises); //value of each promise is obtained with the "promise.all" method. Is added await - to wait for promises to come true. Then allValues will allow to access the values from the API.
    console.log(allValues); //We get an Array with 3 elements: 1 - categories 2 - glass 3 - ingredients.

    //Reflect 3 elements in 3 different arrays (using destructuring assignment):
    const [allCategories, allGlasses, allIngredients] = allValues; 
    console.log(allCategories); console.log(allGlasses); console.log(allIngredients);

    //To use later variables, is needed to load them from a function (create an object (selectValues) to which 3 fields will be assigned)
    selectValues. categories = allCategories.drinks.map(categoryObj=>categoryObj.strCategory) //add drinks and "categories" becomes an array of objects (instead of object+object+array). To avoid unnecessary object inside the array, we use "map"(to get only the category values without the "strCategory" object itself)
    selectValues.glasses = allGlasses.drinks.map(glass=>glass.strGlass) //all glasses in one array
    selectValues.ingredients = allIngredients.drinks.map(ingredients=>ingredients.strIngredient1) //all ingredients in one array
    console.log(selectValues); 

    //to make the selects work (replace response.drinks with new value allCategories.drinks)
    fillSelect(allCategories.drinks, categorySelectElement, "strCategory");
    fillSelect(allGlasses.drinks, glassSelectElement, "strGlass");
    fillSelect(allIngredients.drinks, ingredientSelectElement, "strIngredient1");
}

function fillSelect(properties, selectElement, strFieldName ){ //Fills all select with options according to parameters
    let dynamicHTML = '';
    for(const property of properties){
        // console.log(selectValues.categories); 
        dynamicHTML += `<option>${property[strFieldName]}</option>`;
    }
    selectElement.innerHTML += dynamicHTML; //"+"  add together what is in html
}

// a function that will call all the drinks from the API, when the drinks will be in one array - reflection will be done
async function getAllDrinks(){ // https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink
    const categoryDrinksUrls =  []; //the array is filled during the cycle
    for (const category of selectValues.categories){ //Loop through all available categories in "selectValues.categories"
        let dynamicUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(" ", "_")}`; //Dynamic url generated for each category
        categoryDrinksUrls.push(dynamicUrl); //dynamic url appears in the empty array in order to be able to do promise.all
    }
    const allPromises = categoryDrinksUrls.map((url) => fetch(url).then(response => response.json())); //For each url, fetch is done + parsing by using a single array "categoryDrinksUrls" and the map method (takes all links and changes them)
    const allValues = await Promise.all(allPromises) //Value of each promise is obtained with the "promise.all" method. Adds await - to wait for promises to come true. Then allValues will allow to access the values from the API.

    console.log(categoryDrinksUrls);
    console.log(allPromises);
    console.log(allValues); //under each category, we get drinks as separate objects

//Each of the drink objects (each drink) has to be extracted and placed in the "drinksArray" array. Is needed to iterate through each object that is in "allValues" array using "forEach"
    allValues.forEach((value) => drinksArray.push(...value.drinks))
    //loop through each value + the callback function will tell what will happen during the each loop circle
    //(value) - the meaning of each value (one drinks array in object). In each iteration we get one row: one object containing the array and that object is (value)
    // pushinti - to spread (...) value of array extracted from object
}

function generateDrinksHTML(drinks){  //dynamic rendering
    let dynamicHTML = "";
    for(let drink of drinks){ //iterated through each drink
        //the fields to be replaced are taken from "drinksArray"
        dynamicHTML += `   
        <div class="drink" onclick="openModal(${drink.idDrink})">
            <img src="${drink.strDrinkThumb}" alt="Coctail photo">
            <h2 class="drink-title mb-4">${drink.strDrink}</h2>
        </div>
        `;
    }
    dynamicDrinksElement.innerHTML = dynamicHTML; 
}

// Async because during filtration  will call the API to get the drinks according to the given filters (local filtration when the name of the drink is specified but when the selects are specified the API is called)
async function filter (event){  //there are no parameters because we get them from select inputs. The function is triggered only when the button is pressed
    const searchValue = coctailNameFilterElement.value, //first filter by name and then filter by selects
            category =  categorySelectElement.value,
            glass = glassSelectElement.value,
            ingredient = ingredientSelectElement.value;
        console.log(searchValue, category, glass, ingredient);

    let filteredArray = [...drinksArray] //make a copy of  drinksArray (all drinks) and in that will happen filtering
    console.log(filteredArray);//all 412 drinks are visible

    if(searchValue){ //if searchValue exists, then filtration takes place
    filteredArray = filteredArray.filter((drinkObj) => drinkObj.strDrink.toLowerCase().includes(searchValue.toLowerCase())) //filtro viduje yra callback funkcija kuri grazina true (paliekama reiksme) arba false reiksme (objektas pasalinamas is masyvo)
    } 
    console.log(filteredArray); //filtered drinks are visible only by the first field (name)

    if (category !== "Select Category..."){
    // 1. From the API we fetch drinks according to the selected category 
    // 2. Recived drinks have an id. Check whether "filteredArray" drinks id exists in any of received "drinksOfCategory" drinks fetching.
    // 3. If it exists, the value is left in the "filteredArray" array (because such a drink with this id already exists in the selected category)
    // 4. If it does NOT exist, the value is removed from the "filteredArray" array
    console.log(category); //see category name "string"

    const promise = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(" ", "_")}`); //pakeiciamas kategorijos pavadinimas. Awaite leidzia palaukti promise 
    const drinksOfCategory = await promise.json(); // from promise data is being parsed
    console.log(drinksOfCategory); // Result: an array with the names of the drinks under a given category is retrieved ]

    // Loop through all drinks in the "filteredArray" array
    // Goes through each of the "drinksOfCategory" object's value (already filtered array) and checks if its id matches the id from "filteredArray"
    // "Some" method will return true(the value is left in the array)/false (the value is removed from the array). Inside it checking if at least one "drinksOfCategory" matches the criteria = id is the same as the id of the current drink "drink". 
    // Array method in array method: (drink) - drink from filtered array / current value / value
    filteredArray = filteredArray.filter((drink) => drinksOfCategory.drinks.some((drinksOfCategory) => drink.idDrink === drinksOfCategory.idDrink));
        // .filter - filters out those elements that return false in the callback function. Gives back the filtered array;
        // .some - checks if at least one field in the array matches the criteria, if so - returns true, otherwise false;
    }   
    console.log(filteredArray); //  filtered drinks are only visible by 1-2 fields

    if (glass !== "Select Glass Type..."){
    console.log(glass); // see glass name "string"

    const promise = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${glass.replaceAll(" ", "_")}`); //pakeiciamas glass pavadinimas. Awaite leidzia palaukti promise 
    const drinksOfGlass = await promise.json(); // the data itself is parsed from the promise
    console.log(drinksOfGlass); // Result: an array with the names of the drinks is returned under glass type

    filteredArray = filteredArray.filter((drink) => drinksOfGlass.drinks.some((drinksOfGlass) => drink.idDrink === drinksOfGlass.idDrink));
    }
    console.log(filteredArray); // filtered drinks by fields 1-2-3 are visible

    if (ingredient !== "Select Ingredient..."){           
    console.log(ingredient); // see glass name "string"

    const promise = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient.replaceAll(" ", "_")}`); //pakeiciamas ingredient pavadinimas. Awaite leidzia palaukti promise 
    const drinksOfIngredient = await promise.json(); // the data itself is parsed from the promise
    console.log(drinksOfIngredient); //  Result: an array with the names of the drinks is returned under ingredient type

    filteredArray = filteredArray.filter((drink) => drinksOfIngredient.drinks.some((drinksOfIngredient) => drink.idDrink === drinksOfIngredient.idDrink));
    }
    console.log(filteredArray); //filtered drinks by fields 1-2-3-4 are visible

    generateDrinksHTML(filteredArray); //to display the result of the filtering need to call "generateDrinksHTML" with parameter "filteredArray"
    //noteOfDrinks.style.display = 'none';
    //note.style.display = 'block';
    //buttonReset.style.display = 'none'; 

    // LocalStorage: filter storage (Before validation, otherwise it won't listen these instructions)
    saveFiltersToLocalStorage();

    // Validations:  if any filter is selected
    // is added event.target.id === 'search' ---> o work only when the search button is pressed
    if (event.target.id === 'search' && !coctailNameFilterElement.value && categorySelectElement.value === 'Select Category...' && glassSelectElement.value === 'Select Glass Type...' && ingredientSelectElement.value === 'Select Ingredient...') {
        note.style.display = 'block';
        note.innerText = 'Please, use at least one filter field !';
        note.style.backgroundColor = 'rgba(250, 235, 215, 0.24);';
        return;
    } else {
        note.style.display = 'none';
        buttonReset.style.display = 'block'; 
        buttonReset.innerText = 'Reset Filters';
        noteOfDrinks.style.display = 'none';
    }
        // If there are no results after filtering
    if (filteredArray.length === 0) {
        note.innerText = 'No results found with the selected filters 🥲';
        note.style.display = 'block';
        note.style.backgroundColor = 'rgba(250, 235, 215, 0.24);';
        return;
    } else {
        note.style.display = 'none';
        buttonReset.style.display = 'block'; 
        buttonReset.innerText = 'Reset Filters';
        noteOfDrinks.style.display = 'none';
    }
}

function reset() {
    coctailNameFilterElement.value = ''; 
    categorySelectElement.value = 'Select Category...'; 
    glassSelectElement.value = 'Select Glass Type...'; 
    ingredientSelectElement.value = 'Select Ingredient...';

    // Generate drinks HTML with initial drinks array - drinksArray
    generateDrinksHTML(drinksArray);
    buttonReset.style.display = 'none';
    note.style.display = 'none';
    noteOfDrinks.style.display = 'none';

// LocalStorage: removing filters
localStorage.removeItem('filters');
}

// opening (when clicking on picture): add an onclick listener on each drink with class "drink" via js function "generateDrinksHTML". As parameter specify is  (${drink.idDrink}) 
// async- is needed to wait  before displaying the data  
async function openModal (id) { //the id is specified because it will be used to retrieve data from the API and display it in the modal later
    modalOpen.style.display = "flex";
    const promise = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const response = await promise.json();
    console.log(response);
    const drink = response.drinks[0];
    console.log(drink);
    generateModalContent(drink);
}
// openModal(); // only to check

function generateModalContent(drink) {
    modalImg.src = drink.strDrinkThumb;
    modalTitle.innerText = drink.strDrink;
    modalCategory.innerText = drink.strCategory;
    modalAlcohol.innerText = drink.strAlcoholic;
    modalGlass.innerText = drink.strGlass;
    modalRecipe.innerText = drink.strInstructions, drink.strInstructionsIT;

    let ingredientsHTML = ``;
    let ingredients = []; console.log(ingredients);
    let measure = []; console.log(measure);

    //transfer of ingredients to empty arrays
    for (let i = 1; i <= 15; i++) {
        let ingredient = drink[`strIngredient${i}`];
        let count = drink[`strMeasure${i}`];

        if (ingredient) {
            count = count !== null ? count : "On your preference";
            ingredients.push(ingredient);
            measure.push(count);
        }
    }
    // Loops through each element in the "Ingredients" array
    // let index = 0;: Initialize a variable index to start the loop from the first element of the array.
    // index < ingredients.length;: Set the condition to continue the loop as long as the index is less than the length of the ingredients array (15).
    //index++: Increment the index after each iteration. (to do another circle)
    for (let index = 0; index < ingredients.length; index++) {
        ingredientsHTML += `
        <b class="col-sm-6 my-1">${ingredients[index]}</b>
        <p class="col-sm-6 my-1">${measure[index]}</p>`
    }
    modalIngredients.innerHTML = ingredientsHTML;
}

function closeModal () {
    modalOpen.style.display = "none";
}

function EscapeKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

// Random drink from API 
async function randomCoctail() {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
    const object = await response.json();
    const drink = object.drinks[0];
    generateModalContent(drink);
    modalOpen.style.display = "flex";
}

// Link to Alkoholic/nonAlkoholic drinks
async function drinkAlcoholicOrNonAlcoholic() {
    const link =  modalAlcohol.innerText; // take value from html: Alkoholic or non alkoholic
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${link.replaceAll(" ","_")}`);
    const object = await response.json();
    const drinks = object.drinks;
    generateDrinksHTML(drinks); //displaying Alkoholic/non alkoholic drinks by the link
    modalOpen.style.display = "none";
}

// create alphabetical letters/numbers
function createAlphabeticalLinks() {
let letersHTML = ``;
let numbersHTML = ``;
for (let i = 65; i <= 90; i++) {
    let char = String.fromCharCode(i);
    letersHTML += `<a onclick="displayFirstSymbolDrinks('${char}')" href="#">${char}</a>`;
}
for (let i = 49; i <= 57; i++) {
    let char = String.fromCharCode(i);
    numbersHTML  += `<a onclick="displayFirstSymbolDrinks('${char}')" href="#">${char}</a>`;
}
    document.querySelector(".alphabet-letters").innerHTML = letersHTML;
    document.querySelector(".alphabet-numbers").innerHTML = numbersHTML ;
}

// display drinks by first letter/number
async function displayFirstSymbolDrinks(letter) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
    const object = await response.json();
    console.log(object);
    const drinks = object.drinks;
    console.log(drinks);
    if (drinks !== null) {
        generateDrinksHTML(drinks);
        note.style.display = 'none';
        noteOfDrinks.style.display = 'none';
        buttonReset.style.display = 'block'; 
        buttonReset.innerText = 'See all drinks !';
    } else {
        generateDrinksHTML([]);
        noteOfDrinks.style.display = 'block';
        noteOfDrinks.style.backgroundColor = 'rgba(250, 235, 215, 0.24);';
        buttonReset.style.display = 'block'; 
        buttonReset.innerText = 'See all drinks !';
    }
}
  
async function initialization (){ //Describes what happens after the code is run. A function that will enable other functions in sequence so that the application can run with minimal data. 
    await fillSelectElements(); //selectors are filled
    await getAllDrinks(); //all drinks are fed into the "drinksArray" array
    loadFiltersFromLocalStorage();
    // Dynamic display of drinks. Hidden because "filter" has been added (it already has this function) -> then is faster rendering of filters after refreshing page and in the first few seconds there is no default rendering but a filtered rendering immediately
    filter();

    buttonSearch.addEventListener('click', filter); //add after filtering - when select values are already there ("filter"-callback function and it is passed as variable)
    buttonReset.addEventListener('click', reset);
    buttonChallenge.addEventListener("click", randomCoctail);

    modalCloseX.onclick = closeModal;
    modalClose.onclick = closeModal;
    document.addEventListener('keydown', EscapeKey); // esc - close
    modalCloseBackground.addEventListener('click', (event) => { // background - close
    if (event.target === modalCloseBackground) {
        closeModal();}
        });

    modalAlcohol.addEventListener('click', drinkAlcoholicOrNonAlcoholic);

    createAlphabeticalLinks()
}
initialization();

// -------------------LOCAL STORAGE-------------------------------
//1. Function "saveFiltersToLocalStorage()" -----> Create a function that saves selected filter value to localStorage
//2. "saveFiltersToLocalStorage()" --------------> to be used where filters are (because we save filters) and before validation !!! (if after validation then it doesn't listen to those instructions from validation)
//3. Function "loadFiltersFromLocalStorage()" ---> Create a function to retrieve saved filters from localStorage
//4. "loadFiltersFromLocalStorage()"  -----------> run the function together with the filter function inside "Initalization".Then its possible delete "generateDrinksHTML(drinksArray)" to get a faster display 
//5. to make the reset button work is need to add to the "reset" function ---> localStorage.removeItem('filters');

// Save selected filter value to localStorage
function saveFiltersToLocalStorage() {
    localStorage.setItem('coctailNameFilter', coctailNameFilterElement.value);
    localStorage.setItem('categorySelect', categorySelectElement.value);
    localStorage.setItem('glassSelect', glassSelectElement.value);
    localStorage.setItem('ingredientSelect', ingredientSelectElement.value);
}
// Load selected filters from localStorage
function loadFiltersFromLocalStorage() {
    coctailNameFilterElement.value = localStorage.getItem('coctailNameFilter') || '';
    categorySelectElement.value = localStorage.getItem('categorySelect') || 'Select Category...' ;
    glassSelectElement.value = localStorage.getItem('glassSelect') || 'Select Glass Type...';
    ingredientSelectElement.value = localStorage.getItem('ingredientSelect') || 'Select Ingredient...';     
}
