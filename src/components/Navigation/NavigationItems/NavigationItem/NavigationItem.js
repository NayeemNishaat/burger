import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./NavigationItem.module.css";

const NavigationItem = (props) => {
	return (
		<li className={classes.NavigationItem} onClick={props.closed}>
			{/* Created an active class in the css module. And NavLink will auto determine if the link is active or not and assign the "active" class based on it! */}
			<NavLink
				to={props.link}
				exact={props.exact}
				activeClassName={classes.active}
			>
				{props.children}
			</NavLink>
		</li>
	);
};

export default NavigationItem;
