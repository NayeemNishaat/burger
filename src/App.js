import React, { useEffect, Suspense } from "react";
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
// import axios from "./axios-orders";

const Checkout = React.lazy(() => {
	return import("./containers/Checkout/Checkout");
});
const Orders = React.lazy(() => {
	return import("./containers/Orders/Orders");
});
const Auth = React.lazy(() => {
	return import("./containers/Auth/Auth");
});

// Remark: Using global interceptors!
// let error = null;
// axios.interceptors.request.use((req) => {
// 	return req;
// });
// axios.interceptors.response.use(
// 	(res) => {
// 		return res;
// 	},
// 	(err) => {
// 		error = err;
// 	}
// );

const App = (props) => {
	const { onTryAutoSignUp } = props;
	useEffect(() => {
		onTryAutoSignUp();
	}, [onTryAutoSignUp]);

	let routes = (
		<Switch>
			<Route path="/auth" render={(props) => <Auth {...props} />} />
			<Route path="/" exact component={BurgerBuilder} />
			<Route path="/error404" exact component={error404} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuthenticated) {
		routes = (
			<Switch>
				<Route path="/logout" component={Logout} />
				<Route path="/auth" render={(props) => <Auth {...props} />} />
				<Route
					path="/checkout"
					render={(props) => <Checkout {...props} />}
				/>
				<Route
					path="/orders"
					render={(props) => <Orders {...props} />}
				/>
				<Route path="/error404" exact component={error404} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		);
	}

	return (
		<div>
			<Layout>
				{/* {error ? error.message : null} */}
				<Suspense
					fallback={<p>Spinner/Messages to show while loading!</p>}
				>
					{routes}
				</Suspense>
			</Layout>
		</div>
	);
};

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
