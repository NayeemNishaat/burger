import { put } from "redux-saga/effects";
import axios from "axios";
import * as actions from "../actions/index";
import { delay } from "redux-saga/effects";

// Important: * means this is a generator function!
export function* logOutSaga() {
	// Note: "yeild" means execute step by step and after finishing the current step go to the next step!
	yield localStorage.removeItem("token");
	yield localStorage.removeItem("expirationDate");
	yield localStorage.removeItem("userId");
	yield put(actions.logOutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
	yield delay(action.expirationTime * 1000);
	yield put(actions.logOut()); // Important: After delay if we put an action we need to execute it!
}

export function* authUserSaga(action) {
	yield put(actions.authStart());
	const authData = {
		email: action.email,
		password: action.password,
		returnSecureToken: true
	};
	// Note: Achieved by searching "firebase rest auth"!
	let url =
		"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnyWv-xiJM-pjBb8Fr4YWNqqYLVQV6eEE";
	if (!action.isSignUp) {
		url =
			"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnyWv-xiJM-pjBb8Fr4YWNqqYLVQV6eEE";
	}
	try {
		const res = yield axios.post(url, authData);

		const expirationDate = yield new Date(
			new Date().getTime() + res.data.expiresIn * 1000
		); // Note: Reconverting the time to the date!
		yield localStorage.setItem("token", res.data.idToken);
		yield localStorage.setItem("expirationDate", expirationDate);
		yield localStorage.setItem("userId", res.data.localId);

		yield put(actions.authSuccess(res.data.idToken, res.data.localId));
		yield put(actions.checkAuthTimeout(res.data.expiresIn));
	} catch (error) {
		yield put(actions.authFail(error.response.data.error));
	}
}

export function* authCheckStateSaga(action) {
	const token = yield localStorage.getItem("token");
	if (!token) yield put(actions.logOut());
	else {
		const expirationDate = yield new Date(
			localStorage.getItem("expirationDate")
		);

		if (expirationDate <= new Date()) {
			yield put(actions.logOut());
		} else {
			const userId = yield localStorage.getItem("userId");
			yield put(actions.authSuccess(token, userId));
			yield put(
				actions.checkAuthTimeout(
					expirationDate.getTime() - new Date().getTime() / 1000
				)
			);
		}
	}
}
