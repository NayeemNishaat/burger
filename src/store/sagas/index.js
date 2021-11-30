import { takeEvery, all, takeLatest } from "@redux-saga/core/effects";
import {
	logOutSaga,
	checkAuthTimeoutSaga,
	authUserSaga,
	authCheckStateSaga
} from "./auth";
import { initIngredientsSaga } from "./burgerBuilder";
import { purchaseBurgerSage, fetchOrdersSaga } from "./order";
import * as actionTypes from "../actions/actionTypes";

export function* watchAuth() {
	// Remark: "all" is used to run multiple tasks simultaneously.
	yield all([
		takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logOutSaga),
		takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
		takeEvery(actionTypes.AUTH_USER, authUserSaga),
		takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
	]);
}

export function* watchBurgerBuilder() {
	yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrder() {
	// Important: "takeLatest" will only execute the latest action such as button click if there are subsequent clicks!
	yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSage);
	yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}
