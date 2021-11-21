export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	};
};

export const checkValidity = (value, rules) => {
	let isValid = true;

	if (rules.isEmail) {
		isValid =
			value
				.trim()
				.match(/^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/) !==
				null && isValid;
		// Note: Alternate
		// isValid = value.trim().search(/.+@.+\..+/gi) !== -1 && isValid;
	}

	if (rules.required) {
		isValid = value.trim() !== "" && isValid;
	}

	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
	}

	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid;
	}

	return isValid;
};
