import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router";
import { updateObject, checkValidity } from "../../shared/utility";

export class Auth extends Component {
	state = {
		controls: {
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
			password: {
				elementType: "input",
				elementConfig: {
					type: "password",
					placeholder: "Password"
				},
				value: "",
				validation: {
					required: true,
					minLength: 8
				},
				valid: false,
				touched: false
			}
		},
		formIsValid: false,
		isSignUp: true
	};

	componentDidMount() {
		if (!this.props.buildingBurger && this.props.authRedirectPath !== "/")
			this.props.onSetAuthRedirectPath("/");
	}

	inputChangedHandler = (controlName, e) => {
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: e.target.value,
				valid: checkValidity(
					e.target.value,
					this.state.controls[controlName].validation
				),
				touched: true
			})
		});

		let formIsValid = true;
		for (const controlName in updatedControls) {
			formIsValid = updatedControls[controlName].valid && formIsValid; // Note: Trick to satisfy all conditions to true!
		}

		this.setState({
			controls: updatedControls,
			formIsValid: formIsValid
		});
	};

	submitHandler = (e) => {
		e.preventDefault();
		this.props.onAuth(
			this.state.controls.email.value,
			this.state.controls.password.value,
			this.state.isSignUp
		);
	};

	switchAuthModeHandler = () => {
		// Note: Functional way of changing state, when next state is dependent on previous state!
		this.setState((prevState) => {
			return {
				isSignUp: !prevState.isSignUp
			};
		});
	};

	// Note: My Way
	// componentDidUpdate() {
	// 	if (this.props.token) this.props.history.push("/");
	// }

	render() {
		const formElementsArray = [];

		for (const i in this.state.controls) {
			formElementsArray.push({
				id: i,
				config: this.state.controls[i]
			});
		}

		let form = formElementsArray.map((formElement) => (
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
				changed={this.inputChangedHandler.bind(this, formElement.id)}
			/>
		));

		if (this.props.loading) {
			form = <Spinner />;
		}

		let errorMessage = null;
		if (this.props.error) {
			errorMessage = (
				<p
					style={{
						color: "red",
						fontWeight: "bolder",
						marginTop: "10px"
					}}
				>
					{this.props.error.message
						.toLowerCase()
						.split("_")
						.map((w) => w[0].toUpperCase() + w.slice(1))
						.join(" ")}
				</p>
			);
		}

		let authRedirect = null;
		if (this.props.isAuthenticated) {
			authRedirect = <Redirect to={this.props.authRedirect} />;
		}

		return (
			<div className={classes.Auth}>
				{authRedirect}
				<p>{this.state.isSignUp ? "SIGN UP" : "SIGN IN"}</p>
				{errorMessage}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button
						btnType="Success"
						disabled={!this.state.formIsValid}
					>
						SUBMIT
					</Button>
				</form>
				<Button clicked={this.switchAuthModeHandler} btnType="Danger">
					SWITCH to {this.state.isSignUp ? "SIGN IN" : "SIGN UP"}
				</Button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirect: state.auth.authRedirectPath
		// token: state.auth.token
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) =>
			dispatch(actions.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: (path) => {
			dispatch(actions.setAuthRedirectPath(path));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
