import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.module.css";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from "../../../shared/utility";
import { Redirect } from "react-router";

export class ContactData extends Component {
	// Point: It's ok to manage the state regarding the form in it's own component because it's UI related and it't not effecting any other component and the state is not mostly used in any other components. So it's better to put it's state in itself!

	state = {
		orderForm: {
			name: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Name"
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Street"
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "ZIP"
				},
				value: "",
				validation: {
					required: true,
					minLength: 3,
					maxLength: 5
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Country"
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: "input",
				elementConfig: {
					type: "email",
					placeholder: "Email"
				},
				value: "",
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: "select",
				elementConfig: {
					options: [
						{ value: "fastest", displayValue: "Fastest" },
						{ value: "cheapest", displayValue: "Cheapest" }
					]
				},

				// Important: We need to set default case for select element's value if the options are not changed!
				value: "fastest",
				validation: {},
				valid: true
			}
		},
		formIsValid: false
	};

	orderHandler = (e) => {
		e.preventDefault();

		const formData = {};

		// Point: value is updated immediately after each keystroke in orderForm. After that generating formData with the stored key-value pair from orderForm!
		for (const formElIdentifier in this.state.orderForm) {
			formData[formElIdentifier] =
				this.state.orderForm[formElIdentifier].value;
		}

		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId
		};

		this.props.onOrderBurger(order, this.props.token);

		// axios
		// 	.post("/orders.json", order)
		// 	.then(() => {
		// 		this.setState({ loading: false });
		// 		this.props.history.push("/");
		// 	})
		// 	.catch(() => {
		// 		this.setState({ loading: false });
		// 	});
	};

	// checkValidity(value, rules) {
	// 	let isValid = true;

	// 	// Remark: ways to handle the dropdown undefined error is by adding the empty "validation" object!
	// Point: if (!rules) return true;
	// Point: if (rules && rules.required) {...

	// 	if (rules.isEmail) {
	// 		isValid = value.trim().match(/.+@.+\..+/gi) !== null && isValid;
	// 	}

	// 	if (rules.required) {
	// 		isValid = value.trim() !== "" && isValid;
	// 	}

	// 	if (rules.minLength) {
	// 		isValid = value.length >= rules.minLength && isValid;
	// 	}

	// 	if (rules.maxLength) {
	// 		isValid = value.length <= rules.maxLength && isValid;
	// 	}

	// 	return isValid;
	// }

	// Point: Alternative for "bind"
	// inputChangedHandler = (e, inputIdentifier ) => {

	inputChangedHandler = (inputIdentifier, e) => {
		// Important: Remark: Note: When using "bind" we have to define "this" as the first argument and at the function we have to accept "e" as the last parameter!

		// Important: Note: Deep cloning object only till 2nd level!

		const updatedFormElemet = updateObject(
			this.state.orderForm[inputIdentifier],
			{
				value: e.target.value,
				valid: checkValidity(
					e.target.value,
					this.state.orderForm[inputIdentifier].validation
				),
				touched: true
			}
		);

		const updatedOrderForm = updateObject(this.state.orderForm, {
			[inputIdentifier]: updatedFormElemet
		});

		// updatedFormElemet.value = e.target.value;
		// updatedFormElemet.valid = this.checkValidity(
		// 	updatedFormElemet.value,
		// 	updatedFormElemet.validation
		// );
		// updatedFormElemet.touched = true;
		// updatedOrderForm[inputIdentifier] = updatedFormElemet;

		let formIsValid = true;
		for (const inputIdentifier in updatedOrderForm) {
			formIsValid =
				updatedOrderForm[inputIdentifier].valid && formIsValid; // Note: Trick to satisfy all conditions to true!
		}

		this.setState({
			orderForm: updatedOrderForm,
			formIsValid: formIsValid
		});
	};

	render() {
		// Important: "name" is must for form elements to create query string in URL!
		const formElementsArray = [];

		for (const i in this.state.orderForm) {
			formElementsArray.push({
				id: i,
				config: this.state.orderForm[i]
			});
		}

		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map((formElement) => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						id={formElement.id}
						name={formElement.id}
						invalid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched}
						// Note: We want an "invalid" property hence we are sending reverse of valid!
						changed={this.inputChangedHandler.bind(
							this,
							formElement.id
							// Remark: "id" is used to indicate which element needs to change!
						)}
						// Point: Alternative for "bind"
						// changed={(e) =>
						// 	this.inputChangedHandler(e, formElement.id)
						// }
					/>
				))}
				<Button btnType="Success" disabled={!this.state.formIsValid}>
					ORDER
				</Button>
			</form>
		);

		if (this.props.loading) {
			form = <Spinner />;
		}

		let redirect = null;
		if (this.props.error) {
			redirect = (
				<Redirect
					to={{
						pathname: "/error404",
						state: { message: this.props.error }
					}}
				/>
			);
		}

		return (
			<div className={classes.ContactData}>
				{redirect}
				<h4>Enter your contact data!</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		error: state.order.error,
		token: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);
