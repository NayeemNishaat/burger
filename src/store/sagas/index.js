import { takeEvery } from "@redux-saga/core/effects";
import {
	logOutSaga,
	checkAuthTimeoutSaga,
	authUserSaga,
	authCheckStateSaga
} from "./auth";
import { initIngredientsSaga } from "./burgerBuilder";
import * as actionTypes from "../actions/actionTypes";

export function* watchAuth() {
	yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logOutSaga);
	yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
	yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
	yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
}

export function* watchBurgerBuilder() {
	yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}
