import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";
const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false,
	building: false
};

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
};

const addIngredient = (state, action) => {
	const updatedIngredient = {
		[action.ingredientName]: state.ingredients[action.ingredientName] + 1
	};
	const updatedIngredients = updateObject(
		state.ingredients,
		updatedIngredient
	);
	const updatedState = {
		ingredients: updatedIngredients,
		totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
		building: true
	};
	return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
	const updatedIng = {
		[action.ingredientName]: state.ingredients[action.ingredientName] - 1,
		building: true
	};
	const updatedIngs = updateObject(state.ingredients, updatedIng);
	const updatedSt = {
		ingredients: updatedIngs,
		totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
	};
	return updateObject(state, updatedSt);
};

const setIngredient = (state, action) => {
	return updateObject(state, {
		ingredients: {
			salad: action.ingredients.salad,
			bacon: action.ingredients.bacon,
			cheese: action.ingredients.cheese,
			meat: action.ingredients.meat
		},
		totalPrice: 4,
		error: false,
		building: false
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT:
			return addIngredient(state, action);
		// {
		// ...state
		// {
		// Important: We copied the ingredients object again because the previous copy will only copy the first layer!
		// ...state.ingredients,
		// Important: Point: ES6 way of creating object key overwriting the previous key!
		// [action.ingredientName]:
		// state.ingredients[action.ingredientName] + 1
		// },
		// };
		case actionTypes.REMOVE_INGREDIENT:
			return removeIngredient(state, action);
		case actionTypes.SET_INGREDIENTS:
			return setIngredient(state, action);
		// return {
		// 	...state,
		// 	ingredients: {
		// 		salad: action.ingredients.salad,
		// 		bacon: action.ingredients.bacon,
		// 		cheese: action.ingredients.cheese,
		// 		meat: action.ingredients.meat
		// 	},
		// 	totalPrice: 4,
		// 	error: false
		// };
		case actionTypes.FETCH_INGREDIENTS_FAILED:
			return updateObject(state, { error: true });
		default:
			return state;
	}
};
export default reducer;
