import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem";
import classes from "./NavigationItems.module.css";

const NavigationItems = (props) => {
	return (
		<ul className={classes.NavigationItems}>
			{/* exact is boolean hence send in this way and props are sent {...props} this way! */}
			<NavigationItem link="/" exact closed={props.closed}>
				Burger Builder
			</NavigationItem>
			{props.isAuthenticated ? (
				<NavigationItem closed={props.closed} link="/orders">
					Orders
				</NavigationItem>
			) : null}
			{props.isAuthenticated ? (
				<NavigationItem link="/logout" closed={props.closed}>
					LOG OUT
				</NavigationItem>
			) : (
				<NavigationItem link="/auth" closed={props.closed}>
					Authenticate
				</NavigationItem>
			)}
		</ul>
		// Remark: anctive is a boolean. So it is sent like this.
	);
};

export default NavigationItems;
