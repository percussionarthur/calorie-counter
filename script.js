// talk about the code. create a readme.MD to explain things

// initialize variables from DOM nodes
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
// the variable entryDropdown comes from the html select element with options for with diff values per meal/exercise
const entryDropdown = document.getElementById('entry-dropdown');
// the variable addEntryButton comes from the button element 
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

// this function is used for the getCaloriesFromInput function 
function cleanInputString(str) {
  // this regex will remove all instances of + - and spaces. arguments between / / are encompassing
  const regex = /[+-\s]/g; 
  // the replace method will return a new string(strings are immutable).
  // first argument is the sequence to be replaced, second argument is the string to replaced matched sequence
  return str.replace(regex, ''); // return a new string without our defined parameters

}

function isInvalidInput(str) {
  // this regex will remove all instances of a string comprised of a e with a digits preceding and following.
  // pretty much exponents
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// this function adds an new element inside the input container element.
function addEntry() {
  // the variable below targets the div element that corresponds with the id and input container
  /* the entryDropdown.value is generated when the click event fires. the value selected in the dropdown 
  menu is the one that is created when running addEntry()
  */
  // the #id is created using the accessing the selected value and preceding with #

  // querySelectorAll creates a nodelist(somewhat array)
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  // entryNumber is the number of divs that are added.
  // when targetInputContainer.querySelectorAll runs there are no divs present, so + 1 is required
  // when there are more entries, querySelectorAll() will return a longer nodeList thus increasing length
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;

  // this inserts a HTMLString elements into the div located in the respective input-container
  // "beforeend" inserts -inside the element, after its last child-
  // the second argument si a string to be parsed as HTML and inserted into DOM tree.
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// this function uses the getCaloriesFromInputs() function
function calculateCalories(e) {
  // the e parameter gives preventDefault() method something to use
  // the default action of the submit button is to reload the page. preventDefault() negates that
  e.preventDefault();
  isError = false;

  // these variables contain nodeLists generated from the entries we created from addEntry();
  // these variables are the calorie inputs
  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');


  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  // stops function execution if isError is true;
  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  // output refers to the div element with id="output"
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  // the output element is class="hide". in the CSS, .hide is set as display: none; removing
  output.classList.remove('hide');
}

// this function is used in the the calculateCalories function
// this function will takes the nodeLists we create in calculateCalories function
// this function adds all the calorie numbers together
function getCaloriesFromInputs(list) {
  let calories = 0;

  // this for..of loop cycles through each item in our nodeList
  for (const item of list) {
    /* item.value is required because item only refers to the node. item.value would get the 
        string associated with the node. 
    */
    // console.log(typeof item); returns object
    // console.log(type of item.value) returns string
    const currVal = cleanInputString(item.value);
    // this variable is either true or false, if one of the value is false, then the for loop stops.
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    // values retrieved from HTML input fields are always strings regardless of the type.
    // the currVal variable are strings so it needs to be converted to a number
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  // Array.from() creates an array from an array like object
  // in this case, the nodeList becomes an Array.
  /*  creates an array with the dom nodes .input-container corresponding to each meal type: 
  breakfast, lunch.....exercise .
  */
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  /* takes the array we created from the nodelist and removes all the elements that 
       were inside the .input-container by settting as empty string
       */
  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  // resets to default empty values
  budgetNumberInput.value = '';
  // .innerText returns all the text contained by an element and all its child elements
  // innerHTML returns all text and html tags(this allows the creation of new html elements)
  // could also use .innerHTML for this.
  output.innerText = '';
  output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener('click', clearForm);
