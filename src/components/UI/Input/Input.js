import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
	const inputClasses = [classes.InputElement];
	const toolTipClasses = [classes.ValidationError, classes.Hidden];

	if (props.invalid && props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid);
		toolTipClasses.pop();
	}

	const validationError = (
		<span className={toolTipClasses.join(" ")}>
			Please enter a valid {props.elementConfig.placeholder}!
		</span>
	);

	// Note: Switch is used when we have multiple fixed known options!
	let inputElement = null;
	switch (
		props.elementType // Remark: HTMl and DOM is case insensitive. Hence react will not recognize this prop on a DOM element. So, we have to use all lowercase!
	) {
		case "input":
			inputElement = (
				<input
					className={inputClasses.join(" ")}
					{...props.elementConfig}
					// Important: Here {} doesn't represent an object rather a syntax for inserting dynamic Js code!
					value={props.value}
					id={props.id}
					name={props.name}
					onChange={props.changed}
				/>
			);
			break;
		case "textarea":
			inputElement = (
				<textarea
					className={inputClasses.join(" ")}
					{...props.elementConfig}
					value={props.value}
					id={props.id}
					name={props.name}
					onChange={props.changed}
				/>
			);
			break;
		case "select":
			inputElement = (
				<select
					className={inputClasses.join(" ")}
					value={props.value}
					id={props.id}
					name={props.name}
					onChange={props.changed}
				>
					{props.elementConfig.options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.displayValue}
						</option>
					))}
				</select>
			);
			break;
		default:
			inputElement = (
				<input
					className={inputClasses.join(" ")}
					{...props.elementConfig}
					value={props.value}
					id={props.id}
					name={props.name}
					onChange={props.changed}
				/>
			);
	}

	return (
		<div className={classes.Input}>
			<label className={classes.Label} htmlFor={props.id}>
				{props.label}
			</label>
			<div className={classes.InputParent}>
				{validationError}
				{inputElement}
			</div>
		</div>
	);
};

export default Input;
