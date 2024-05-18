
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

	return (
		<>
		<div>
			<button onClick={() => props.setPage("login")}>Logga ut</button>
			<button onClick={() => props.setPage("home")}>Homepage</button>
		</div>

		</>
	);
}

export default Menu;