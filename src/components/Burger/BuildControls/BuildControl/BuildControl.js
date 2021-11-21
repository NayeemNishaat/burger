import React from "react";
import classes from "./BuildControl.module.css";

const BuildControl = (props) => (
	<div className={classes.BuildControl}>
		<div className={classes.Label}>{props.label}</div>
		<button className={classes.Add} onClick={props.added}>
			Add
		</button>
		<button
			className={classes.Remove}
			onClick={props.removed}
			disabled={props.disabled}
		>
			Remove
		</button>
	</div>
);

export default BuildControl;
