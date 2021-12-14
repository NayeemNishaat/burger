import React, { useState, useEffect, Fragment } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index"; // Point: "index" can be omitted!

const BurgerBuilder = (props) => {
	// Important: Note: purchasable, purchasing, loading and error are local UI state. These are not highly used in any other components. So, it's better to manage them locally. Ingredients and total proice are used in other components. So, we should manage those by using "redux"!
	const [purchasing, setPurchasing] = useState(false);

	const { onInitIngredients } = props;

	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	// componentDidMount() {
	// axios
	// 	.get(
	// 		"https://burger-lby-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json"
	// 	)
	// 	.then((res) => {
	// 		this.setState({ ingredients: res.data });
	// 	})
	// 	.catch(() => {
	// 		this.setState({ error: true });
	// 	});
	// }

	const purchaseContinueHandler = () => {
		// const queryParams = [];
		// for (const i in props.ings) {
		// 	queryParams.push(`
		// 		${encodeURIComponent(i)}=${encodeURIComponent(props.ings[i])}`);
		// }

		// queryParams.push(`price=${props.price}`);
		// const queryString = queryParams.join(`&`);

		props.onInitPurchase();
		props.history.push("/checkout");
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};

	// Note: Always use arrow funtion. Ran into trouble for using function expression!
	const purchaseHandler = () => {
		if (props.isAuthenticated) setPurchasing(true);
		else {
			props.onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const updatePurchaseHandler = (ingredients) => {
		const sum = Object.values(ingredients).reduce((acc, el) => {
			return acc + el;
		}, 0);

		return sum > 0;
	};

	const disabledInfo = {
		...props.ings
	};

	// Remark: for-in loop is used for objects and it mutates the original object and returns that object!
	for (const key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] === 0;
	}

	let orderSummary = null;
	let burger = props.error ? (
		props.history.push("/error404", { message: props.error })
	) : (
		<Spinner />
	);

	if (props.ings) {
		burger = (
			<Fragment>
				<Burger ingredients={props.ings} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					// Important: Remark: We don't need to pass the argument here because we are already passing the argument from the "BuildControls" component!
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					isAuth={props.isAuthenticated}
					price={props.price}
					purchasable={updatePurchaseHandler(props.ings)}
					ordered={purchaseHandler}
				/>
			</Fragment>
		);

		orderSummary = (
			<OrderSummary
				price={props.price}
				ingredients={props.ings}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		);
	}

	return (
		<Fragment>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token != null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) =>
			dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(actions.setAuthRedirectPath(path))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder); // Remark: "connect" with return a function that adds some extra props to the element!
