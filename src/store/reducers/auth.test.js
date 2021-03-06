import reducer from "./auth";
import * as actionTypes from "../actions/actionTypes";

describe("Auth Reducer", () => {
	it("Should return the initial state", () => {
		expect(reducer(undefined, {})).toEqual({
			token: null,
			userId: null,
			error: null,
			loading: false,
			authRedirectPath: "/"
		});
	});

	it("Should store the token upon login!", () => {
		expect(
			reducer(
				{
					token: null,
					userId: null,
					error: null,
					loading: false,
					authRedirectPath: "/"
				},
				{
					type: actionTypes.AUTH_SUCCESS,
					idToken: "Token",
					userId: "User ID"
				}
			)
		).toEqual({
			token: "Token",
			userId: "User ID",
			error: null,
			loading: false,
			authRedirectPath: "/"
		});
	});
});
