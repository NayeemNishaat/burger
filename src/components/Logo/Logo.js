import React from "react";
import burgerLogo from "../../assets/imges/burger-logo.png";
import classes from "./Logo.module.css";

const Logo = (props) => {
	return (
		<div className={classes.Logo} /* style={{ height: props.height }} */>
			<img src={burgerLogo} alt="Logo" />
		</div>
	);
};

export default Logo;
