import React, { Fragment, Component } from "react";
import Modal from "../components/UI/Modal/Modal";

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		// Important: Remark: Point: This componentDidMount() method works best for the post request. But not good for get request. Because this method will only run after all the child components are finished rendering. So the interceptors are set only after the request has been created. Hence it will not catch any error! So we need to set the interceptors before the child components are rendered. We can do this by using componentWillMount() or the constructor()!
		constructor(props) {
			super(props);

			this.state = {
				error: null
			};

			this.reqInterceptor = axios.interceptors.request.use((req) => {
				this.setState = { error: null };
				return req;
			});
			this.resInterceptor = axios.interceptors.response.use(
				(res) => res,
				(error) => {
					this.setState = { error: error };
				} // Remark: Editing state directly inside constructor is allowed!
			);
		}

		// UNSAFE_componentWillMount() {
		// 	this.reqInterceptor = axios.interceptors.request.use((req) => {
		// 		this.setState({ error: null });
		// 		return req;
		// 	});
		// 	this.resInterceptor = axios.interceptors.response.use(
		// 		(res) => res,
		// 		(error) => this.setState({ error: error })
		// 	);
		// }

		componentWillUnmount() {
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.request.eject(this.resInterceptor);
		}

		errorConfirmedHandler = () => {
			this.setState({ error: null });
		};

		render() {
			return (
				<Fragment>
					<Modal
						show={this.state.error}
						modalClosed={this.errorConfirmedHandler}
					>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
					{/* Important: Remark: Here I am simply forwarding the props to the component that it receives. Structuring and Destructuring */}
				</Fragment>
			);
		}
	};
};

export default withErrorHandler;
