import { put } from "redux-saga/effects";
import axios from "../../axios-orders";
import * as actions from "../actions/index";

export function* initIngredientsSaga() {
	try {
		// Point: Double dispatch for async task.
		const res = yield axios.get(
			"https://burger-lby-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json"
		);
		yield put(actions.setIngredients(res.data));
	} catch (error) {
		yield put(actions.fetchIngredientsFailed(error.message));
	}
}
