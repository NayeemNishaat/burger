import React from "react";
import PropTypes from "prop-types";
import classes from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const Burger = (props) => {
	let transformedIngredients = Object.keys(props.ingredients)
		.map((igKey) => {
			// Important: Creating an array of ingredients key, ["salad", "cheese"]!
			return [...Array(props.ingredients[igKey])].map((_, i) => {
				return <BurgerIngredient key={igKey + i} type={igKey} />;
			});
		})
		.flat();
	/* .reduce((previousValue, currentValue) => {
			return previousValue.concat(currentValue);
		}, []); */ // Remark: Initially previousValue === [] and it is always updated by interacting with corrent value!

	if (transformedIngredients.length === 0) {
		transformedIngredients = <p>Please start adding ingredients!</p>;
	}

	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{transformedIngredients}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

Burger.propTypes = {
	ingredients: PropTypes.object
};

export default Burger;
