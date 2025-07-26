const ingredientLineEl = document.getElementById('ingredient-line');
const addIngredientBtnEl = document.getElementById('add-ingredient-btn');
const ingredientAreaEl = document.getElementById('ingredient-area');

function evtAddIngredientLine(evt){
  const newIngredientLineEl = ingredientLineEl.cloneNode(true);
  ingredientAreaEl.appendChild(newIngredientLineEl);
};

console.log(ingredientLineEl, addIngredientBtnEl);

addIngredientBtnEl.addEventListener("click", evtAddIngredientLine);
