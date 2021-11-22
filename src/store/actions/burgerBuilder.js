import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredient = (name) => {
	return {
		type: actionTypes.ADD_INGREDIENT,
		ingredientName: name
	};
};

export const removeIngredient = (name) => {
	return {
		type: actionTypes.REMOVE_INGREDIENT,
		ingredientName: name
	};
};

const setIngredients = (ingredients) => {
	return {
		type: actionTypes.SET_INGREDIENTS,
		ingredients: ingredients
	};
};

const fetchIngredientsFailed = (error) => {
	// Note: This dispatch is sync!
	return {
		type: actionTypes.FETCH_INGREDIENTS_FAILED,
		error: error
	};
};

export const initIngredients = () => {
	return (dispatch) => {
		// Point: Double dispatch for async task.
		axios
			.get(
				"https://burger-lby-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json"
			)
			.then((res) => {
				dispatch(setIngredients(res.data));
			})
			.catch((error) => {
				dispatch(fetchIngredientsFailed(error.message));
			});
	};
};
