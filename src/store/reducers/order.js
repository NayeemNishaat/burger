import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
	orders: [],
	loading: false,
	purchased: false,
	error: null
};

const purchaseBurgerSuccess = (state, action) => {
	const newOrder = updateObject(action.orderData, {
		id: action.orderId
	});
	// {
	// Point: Shallow copy works because nothing is changed but added!
	// 	...action.orderData,
	// 	id: action.orderId
	// };
	return updateObject(state, {
		purchased: true,
		loading: false,
		orders: state.orders.concat(newOrder)
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PURCHASE_INIT:
			return updateObject(state, { purchased: false });
		case actionTypes.PURCHASE_BURGER_START:
			return updateObject(state, { loading: true });
		case actionTypes.PURCHASE_BURGER_SUCCESS:
			return purchaseBurgerSuccess(state, action);
		case actionTypes.PURCHASE_BURGER_FAIL:
			return updateObject(state, { loading: false, error: action.error });
		case actionTypes.FETCH_ORDERS_START:
			return updateObject(state, { loading: true });
		case actionTypes.FETCH_ORDERS_SUCCESS:
			return updateObject(state, {
				orders: action.orders,
				loading: false
			});
		case actionTypes.FETCH_ORDERS_FAIL:
			return updateObject(state, { loading: false, error: action.error });
		default:
			return state;
	}
};

export default reducer;
