import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme"; // Remark: shallow is used to render only the shallow copy of the component not the nested components!
import NavigationItems from "./NavigationItems";
import NavigationItem from "./NavigationItem/NavigationItem";

configure({ adapter: new Adapter() });

describe("<NavigationItems />", () => {
	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<NavigationItems />);
	});

	it("should render two <NavigationItem /> elements if not authenticated", () => {
		expect(wrapper.find(NavigationItem)).toHaveLength(2);
	});

	it("should render three <NavigationItem /> elements if authenticated", () => {
		// wrapper = shallow(<NavigationItems isAuthenticated />);
		wrapper.setProps({ isAuthenticated: true });
		expect(wrapper.find(NavigationItem)).toHaveLength(3);
	});

	it("should render Logout <NavigationItem /> element", () => {
		wrapper.setProps({ isAuthenticated: true });
		expect(
			wrapper.contains(
				<NavigationItem link="/logout">LOG OUT</NavigationItem>
			)
		).toEqual(true);
	});
});
