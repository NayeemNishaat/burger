import React, { useEffect } from "react";
import Order from "../../components/Order/Order";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

const Orders = (props) => {
	const { token, userId, onFetchOrders } = props;
	useEffect(() => {
		onFetchOrders(token, userId);
	}, [token, userId, onFetchOrders]); // Point: Don't put the whole props here, causes infinite request loop!

	const redirect = props.error
		? props.history.push("/error404", {
				message: props.error
		  })
		: null;
	let orders = <Spinner />;
	if (!props.loading) {
		orders = props.orders.map((order) => (
			<Order
				key={order.id}
				ingredients={order.ingredients}
				price={order.price}
			/>
		));
	}
	return (
		<div>
			{redirect}
			{orders}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId,
		error: state.order.error
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchOrders: (token, userId) =>
			dispatch(actions.fetchOrders(token, userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
