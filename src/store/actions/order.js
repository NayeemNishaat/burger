import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData
	};
};

const purchaseburgerFail = (err) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: err
	};
};

const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
};

export const purchaseBurger = (orderData, token) => {
	return (dispatch) => {
		dispatch(purchaseBurgerStart());
		axios
			.post("/orders.json?auth=" + token, orderData)
			.then((res) => {
				dispatch(purchaseBurgerSuccess(res.data.name, orderData));
			})
			.catch((error) => {
				dispatch(purchaseburgerFail(error.message));
			});
	};
};

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
};

const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	};
};

const fetchOrdersFail = (err) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		error: err
	};
};

const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START
	};
};

export const fetchOrders = (token, userId) => {
	// Note: (dispatch, getState) getState could be used to get the state but that's not good!
	return (dispatch) => {
		dispatch(fetchOrdersStart());
		// Important: Point: This is the way to use token to access protected resources!
		const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;

		axios
			.get("/orders.json" + queryParams)
			.then((res) => {
				const fetchOrders = [];
				// Remark: In for-in loop i is the key!
				// Note: In for-of loop i is an array for looping through iterables.entries()!
				for (const i in res.data) {
					fetchOrders.push({ ...res.data[i], id: i });
				}

				dispatch(fetchOrdersSuccess(fetchOrders));
			})
			.catch((error) => {
				dispatch(fetchOrdersFail(error.message));
			});
	};
};
