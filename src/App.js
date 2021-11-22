import React, { Component } from "react";
import Layout from "./containers/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
// import Checkout from "./containers/Checkout/Checkout";
// import Orders from "./containers/Orders/Orders";
// import Auth from "./containers/Auth/Auth";
import { Route, Switch, withRouter, Redirect } from "react-router";
import Logout from "./containers/Auth/Logout/Logout";
import error404 from "./components/UI/404/error404";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
import asyncComponent from "./asynComponent/asyncComponent";

const asyncCheckout = asyncComponent(() => {
	return import("./containers/Checkout/Checkout");
});
const asyncOrders = asyncComponent(() => {
	return import("./containers/Orders/Orders");
});
const asyncAuth = asyncComponent(() => {
	return import("./containers/Auth/Auth");
});

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoSignUp();
	}

	render() {
		let routes = (
			<Switch>
				<Route path="/auth" component={asyncAuth} />
				<Route path="/" exact component={BurgerBuilder} />
				<Route path="/error404" exact component={error404} />
				<Redirect to="/" />
			</Switch>
		);

		if (this.props.isAuthenticated) {
			routes = (
				<Switch>
					<Route path="/logout" component={Logout} />
					<Route path="/auth" component={asyncAuth} />
					<Route path="/checkout" component={asyncCheckout} />
					<Route path="/orders" component={asyncOrders} />
					<Route path="/error404" exact component={error404} />
					<Route path="/" exact component={BurgerBuilder} />
					<Redirect to="/" />
				</Switch>
			);
		}

		return (
			<div>
				<Layout>{routes}</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoSignUp: () => dispatch(actions.authCheckState())
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
// Important: Remark: Note: Point: When connect is used "Route" doesn't work properly! So we need to wrap connect with "withRouter()" to make the Route work again!
