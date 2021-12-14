import React, { useState } from "react";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import classes from "./Layout.module.css";
import { connect } from "react-redux";

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHandler = () => {
		// Important: If you want to use state in setState you should use the special syntex. Else you will get error due to the async behaviour of the setState! prevState is automatically passed in setState!
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	return (
		<>
			<Toolbar
				isAuth={props.isAuthenticated}
				drawerToggleClicked={sideDrawerToggleHandler}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				open={sideDrawerIsVisible}
				closed={sideDrawerClosedHandler}
			/>
			<main className={classes.content}>{props.children}</main>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(Layout);
