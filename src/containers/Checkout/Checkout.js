import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route, Redirect } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";

export class Checkout extends Component {
	// Point: componentWillMount() triggers before render() and after that componentDidMount() will trigger. Hence we need componentWillMount() here!
	// componentWillMount() {
	// 	const query = new URLSearchParams(this.props.location.search);
	// 	const ingredients = {};
	// 	let price = 0;
	// 	// for (const i in query.entries()) {
	// 	// 	console.log(i);
	// 	// } // Warning: No possible because URLSearchParams doesn't return an object!
	// 	// Important: Creating ingredients object from iterable!
	// 	for (const param of query.entries()) {
	// 		if (param[0] === "price") {
	// 			price = param[1];
	// 		} else ingredients[param[0].trim()] = +param[1];
	// 	}

	// 	this.setState({ ingredients: ingredients, totalPrice: price });
	// }

	//  Important: We can not run onInitPurchase here because after it runs then the rendering runs with the old props. So, we need to set purchased false before it renders. So moved the logic to the place before rendering/pushing it.
	// componentWillMount() {
	// 	this.props.onInitPurchase();
	// }

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	};

	checkoutContinuedHandler = () => {
		this.props.history.replace("/checkout/contact-data");
	};

	render() {
		let summary = <Redirect to="/" />;
		if (this.props.ings) {
			const purchasedRedirect = this.props.purchased ? (
				<Redirect to="/" />
			) : null;
			summary = (
				<div>
					{purchasedRedirect}
					<CheckoutSummary
						ingredients={this.props.ings}
						checkoutCancelled={this.checkoutCancelledHandler}
						checkoutContinued={this.checkoutContinuedHandler}
					/>
					<Route
						path={this.props.match.path + "/contact-data"}
						component={ContactData}
					/>
				</div>
			);
		}
		return summary;
		// <div>
		// 	 <Route
		// 		path={this.props.match.path + "/contact-data"}
		// 		component={ContactData} // Note: Not using this syntex because it doesn't allow us to send props manually!
		// 		render={(props) => (
		// 			<ContactData
		// 				ingredients={this.state.ingredients}
		// 				totalPrice={this.state.totalPrice}
		// 				{...props}
		// 			/>
		// 		)}
		// 	/>
		// </div>
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		purchased: state.order.purchased
	};
};

export default connect(mapStateToProps)(Checkout);
