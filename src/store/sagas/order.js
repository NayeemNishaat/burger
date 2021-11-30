import axios from "../../axios-orders";
import { put } from "redux-saga/effects";
import * as actions from "../actions";

export function* purchaseBurgerSage(action) {
	yield put(actions.purchaseBurgerStart());
	try {
		const res = yield axios.post(
			"/orders.json?auth=" + action.token,
			action.orderData
		);

		yield put(
			actions.purchaseBurgerSuccess(res.data.name, action.orderData)
		);
	} catch (error) {
		yield put(actions.purchaseburgerFail(error.message));
	}
}

export function* fetchOrdersSaga(action) {
	// Note: (dispatch, getState) getState could be used to get the state but that's not good!

	yield put(actions.fetchOrdersStart());
	// Important: Point: This is the way to use token to access protected resources!
	const queryParams = `?auth=${action.token}&orderBy="userId"&equalTo="${action.userId}"`;

	try {
		const res = yield axios.get("/orders.json" + queryParams);
		const fetchOrders = [];
		// Remark: In for-in loop i is the key!
		// Note: In for-of loop i is an array for looping through iterables.entries()!
		for (const i in res.data) {
			fetchOrders.push({ ...res.data[i], id: i });
		}

		yield put(actions.fetchOrdersSuccess(fetchOrders));
	} catch (error) {
		yield put(actions.fetchOrdersFail(error.message));
	}
}
