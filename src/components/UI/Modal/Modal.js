import React, { memo } from "react";
import classes from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";

const Modal = (props) => (
	<>
		<div
			className={classes.Modal}
			style={{
				transform: props.show ? "translateY(0)" : "translateY(-100vh)",
				opacity: props.show ? "1" : "0"
			}}
		>
			{props.children}
		</div>
		<Backdrop show={props.show} clicked={props.modalClosed} />
	</>
);

// Note: In class based component we can use PureComponent which is equivalent to memo in functional component.
export default memo(Modal); // Remark: It's wrapped with react memo because inside this component orderSummary is placed. And we don't always need to update orderSummary. orderSummary only needs to update when Modal is shown! So, when Modal changes it will update and so the components inside it (orderSummary) will also update.
// shouldComponentUpdate(nextProps, nexrState){
// 	return nextProps.show !== this.props.show || this.props.children !==nextprops.children
// }
// Important: Wrapping element controls the update of the wrapped element!

// export default memo(Modal,
// 	(prevProps, nextProps) =>
// 		prevProps.show === nextProps.show ||
// 		prevProps.children === nextProps.children) // Important: When the function returns false, the component will be re-rendered!
