import React, { useState, useEffect } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router";
import { updateObject, checkValidity } from "../../shared/utility";

const Auth = (props) => {
	const [authForm, setAuthForm] = useState({
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
	});

	const [formIsValid, setFormIsValid] = useState(false);
	const [isSignUp, setIsSignUp] = useState(true);

	const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

	useEffect(() => {
		if (!buildingBurger && authRedirectPath !== "/")
			onSetAuthRedirectPath("/");
	}, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

	const inputChangedHandler = (controlName, e) => {
		const updatedControls = updateObject(authForm, {
			[controlName]: updateObject(authForm[controlName], {
				value: e.target.value,
				valid: checkValidity(
					e.target.value,
					authForm[controlName].validation
				),
				touched: true
			})
		});

		let formIsValid = true;
		for (const controlName in updatedControls) {
			formIsValid = updatedControls[controlName].valid && formIsValid; // Note: Trick to satisfy all conditions to true!
		}

		setAuthForm(updatedControls);
		setFormIsValid(formIsValid);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
	};

	const switchAuthModeHandler = () => {
		// Note: Functional way of changing state, when next state is dependent on previous state!
		// this.setState((prevState) => {
		// 	return {
		// 		isSignUp: !prevState.isSignUp
		// 	};
		// });

		setIsSignUp(!isSignUp);
	};

	// Note: My Way
	// componentDidUpdate() {
	// 	if (props.token) props.history.push("/");
	// }

	const formElementsArray = [];

	for (const i in authForm) {
		formElementsArray.push({
			id: i,
			config: authForm[i]
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
			changed={inputChangedHandler.bind(this, formElement.id)}
		/>
	));

	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;
	if (props.error) {
		errorMessage = (
			<p
				style={{
					color: "red",
					fontWeight: "bolder",
					marginTop: "10px"
				}}
			>
				{props.error.message
					.toLowerCase()
					.split("_")
					.map((w) => w[0].toUpperCase() + w.slice(1))
					.join(" ")}
			</p>
		);
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirect} />;
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			<p>{isSignUp ? "SIGN UP" : "SIGN IN"}</p>
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success" disabled={!formIsValid}>
					SUBMIT
				</Button>
			</form>
			<Button clicked={switchAuthModeHandler} btnType="Danger">
				SWITCH to {isSignUp ? "SIGN IN" : "SIGN UP"}
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirect: state.auth.authRedirectPath
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
