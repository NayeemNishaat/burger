import React, { Component, Fragment } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "../../axios-orders";
import withErrorHandler from "../../withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index"; // Point: "index" can be omitted!

export class BurgerBuilder extends Component {
	// Important: Note: purchasable, purchasing, loading and error are local UI state. These are not highly used in any other components. So, it's better to manage them locally. Ingredients and total proice are used in other components. So, we should manage those by using "redux"!
	state = {
		purchasing: false
		// loading: false,
		// error: false
	};

	componentDidMount() {
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

		this.props.onInitIngredients();
	}

	purchaseContinueHandler = () => {
		// const queryParams = [];
		// for (const i in this.props.ings) {
		// 	queryParams.push(`
		// 		${encodeURIComponent(i)}=${encodeURIComponent(this.props.ings[i])}`);
		// }

		// queryParams.push(`price=${this.props.price}`);
		// const queryString = queryParams.join(`&`);

		this.props.onInitPurchase();
		this.props.history.push("/checkout");
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	// Note: Always use arrow funtion. Ran into trouble for using function expression!
	purchaseHandler = () => {
		if (this.props.isAuthenticated) this.setState({ purchasing: true });
		else {
			this.props.onSetAuthRedirectPath("/checkout");
			this.props.history.push("/auth");
		}
	};

	updatePurchaseHandler = (ingredients) => {
		const sum = Object.values(ingredients).reduce((acc, el) => {
			return acc + el;
		}, 0);

		return sum > 0;
	};

	render() {
		const disabledInfo = {
			...this.props.ings
		};

		// Remark: for-in loop is used for objects and it mutates the original object and returns that object!
		for (const key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] === 0;
		}

		let orderSummary = null;

		let burger = this.props.error ? (
			<p>Failed to get ingredients!</p>
		) : (
			<Spinner />
		);

		if (this.props.ings) {
			burger = (
				<Fragment>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						// Important: Remark: We don't need to pass the argument here because we are already passing the argument from the "BuildControls" component!
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						isAuth={this.props.isAuthenticated}
						price={this.props.price}
						purchasable={this.updatePurchaseHandler(
							this.props.ings
						)}
						ordered={this.purchaseHandler}
					/>
				</Fragment>
			);

			orderSummary = (
				<OrderSummary
					price={this.props.price}
					ingredients={this.props.ings}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
				/>
			);
		}

		return (
			<Fragment>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}
				>
					{orderSummary}
				</Modal>
				{burger}
			</Fragment>
		);
	}
}

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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios)); // Remark: "connect" with return a function that adds some extra props to the element!
