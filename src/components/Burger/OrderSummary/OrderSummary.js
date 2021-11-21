import React, { Fragment } from "react";
import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
	const ingredientsSummary = Object.keys(props.ingredients).map((igKey) => {
		return (
			<li key={igKey}>
				<span style={{ textTransform: "capitalize" }}>{igKey}</span>:
				{props.ingredients[igKey]}
			</li>
		);
	});

	return (
		<Fragment>
			<h3>Your Order</h3>
			<p>A delicious burger with the following ingredients:</p>
			<ul>{ingredientsSummary}</ul>
			<p>
				Total Price: <strong>{props.price.toFixed(2)}$</strong>
			</p>
			<br />
			<p>Continue to Checkout?</p>
			<Button btnType="Danger" clicked={props.purchaseCancelled}>
				CANCEL
			</Button>
			<Button btnType="Success" clicked={props.purchaseContinued}>
				CONTINUE
			</Button>
		</Fragment>
	);
};
export default OrderSummary;
