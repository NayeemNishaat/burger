import React from "react";

const error404 = (props) => {
	return (
		<div
			style={{
				textAlign: "center",
				color: "red",
				font: "46px bold",
				marginTop: "20%"
			}}
		>
			{props.location.state.message}
		</div>
	);
};

export default error404;
