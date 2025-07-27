const ingredientLineEl = document.getElementById('ingredient-line0');
const addIngredientBtnEl = document.getElementById('add-ingredient-btn');
const removeIngredientBtnEl = document.getElementById('remove-ingredient-btn');
const ingredientLinesEl = document.getElementById('ingredient-lines');
const recipeCreationFormEl = document.getElementById('recipe-creation-form');

// ===== Handle adding a new ingredient line to the page =====
function evtAddIngredientLine(evt) {
  const newIngredientLineEl = ingredientLineEl.cloneNode(true); // deep copy the node
  const childCount = ingredientLinesEl.children.length;
  console.log(childCount);

  newIngredientLineEl.id = `ingredient-line${childCount}`

  const nameEl = newIngredientLineEl.querySelector('#ingr-refId0');
  nameEl.name = `ingredients[${childCount}][refId]`;
  nameEl.id = `ingr-refId${childCount}`;
  nameEl.value = ''; // clear value

  const qtyEl = newIngredientLineEl.querySelector('#ingr-qty0');
  qtyEl.name = `ingredients[${childCount}][qty]`;
  qtyEl.id = `ingr-qty${childCount}`;
  qtyEl.value = '0'; // clear value

  const unitEl = newIngredientLineEl.querySelector('#ingr-unit0');
  unitEl.name = `ingredients[${childCount}][unit]`;
  unitEl.id = `ingr-unit${childCount}`;
  unitEl.value = ''; // clear value

  ingredientLinesEl.appendChild(newIngredientLineEl);
};

addIngredientBtnEl.addEventListener("click", evtAddIngredientLine);

// ===== Handle removing an ingredient line from the page =====
function evtRemoveIngredientLine(evt){
  const childCount = ingredientLinesEl.children.length;
  if(childCount === 1) return; // cannot remove last line

  const childrenEls = ingredientLinesEl.children; // get all children
  ingredientLinesEl.removeChild(Array.from(childrenEls).at(-1)); // remove last child
};

removeIngredientBtnEl.addEventListener("click", evtRemoveIngredientLine);
