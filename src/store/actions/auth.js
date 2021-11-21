import * as actionTypes from "./actionTypes";
import axios from "axios";

const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	};
};

const authFail = (err) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: err
	};
};

export const logOut = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("expirationDate");
	localStorage.removeItem("userId");

	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

const checkAuthTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logOut());
		}, +expirationTime * 1000);
	};
};

export const auth = (email, password, isSignUp) => {
	return (dispatch) => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		// Note: Achieved bu searching "firebase rest auth"!
		let url =
			"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnyWv-xiJM-pjBb8Fr4YWNqqYLVQV6eEE";
		if (!isSignUp) {
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnyWv-xiJM-pjBb8Fr4YWNqqYLVQV6eEE";
		}
		axios
			.post(url, authData)
			.then((res) => {
				const expirationDate = new Date(
					new Date().getTime() + res.data.expiresIn * 1000
				); // Note: Reconverting the time to the date!
				localStorage.setItem("token", res.data.idToken);
				localStorage.setItem("expirationDate", expirationDate);
				localStorage.setItem("userId", res.data.localId);

				dispatch(authSuccess(res.data.idToken, res.data.localId));
				dispatch(checkAuthTimeout(res.data.expiresIn));
			})
			.catch((err) => {
				dispatch(authFail(err.response.data.error));
			});
	};
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	};
};

export const authCheckState = () => {
	return (dispatch) => {
		const token = localStorage.getItem("token");
		if (!token) dispatch(logOut());
		else {
			const expirationDate = new Date(
				localStorage.getItem("expirationDate")
			);

			if (expirationDate <= new Date()) {
				dispatch(logOut());
			} else {
				const userId = localStorage.getItem("userId");
				dispatch(authSuccess(token, userId));
				dispatch(
					checkAuthTimeout(
						expirationDate.getTime() - new Date().getTime() / 1000
					)
				);
			}
		}
	};
};
