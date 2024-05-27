
import { useState, useEffect } from 'react';

function Menu(props) {

	useEffect(() => {
		let pageUrl = props.page;

		if(!pageUrl) {
			const queryParameters = new URLSearchParams(window.location.search);
			const getUrl = queryParameters.get("page");

			if (getUrl) {
				pageUrl = getUrl;
				props.setPage(getUrl)
			} else {
				pageUrl = "start"
			}
		} 

		window.history.pushState(
			null,
			"",
			"?page=" + pageUrl
		)

	}, [props.page])

	const logout = () => {
		localStorage.removeItem("id");
		localStorage.removeItem("sessionID");
		props.setPage("login")
	}
	return (
		<>
		<div id="menu">
			<button onClick={() => logout()}>Logga ut</button>
			<button onClick={() => props.setPage("home")}>Homepage</button>
		</div>

		</>
	);
}

export default Menu;