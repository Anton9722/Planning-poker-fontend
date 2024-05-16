// import React from 'react';
import { useState, useEffect } from 'react';
import HomePage from './HomePage';
import Projects from './Projects';

function Menu(props) {

	const [page,setPage] = useState("");

	useEffect(() => {
		let pageUrl = page;

		if(!pageUrl) {
			const queryParameters = new URLSearchParams(window.location.search);
			const getUrl = queryParameters.get("page");

			if (getUrl) {
				pageUrl = getUrl;
				setPage(getUrl)
			} else {
				pageUrl = "start"
			}
		} 

		window.history.pushState(
			null,
			"",
			"?page=" + pageUrl
		)

	}, [page])

	return (
		<>
		<div>
			<h1>Planning Poker</h1>
			<button onClick={() => setPage("login")}>Login</button>
			<button onClick={() => setPage("homepage")}>Homepage</button>
			<button onClick={() => setPage("projects")}>Mina Project</button>
		</div>

		{
			{
				// "login": <LoginComponent/>,
				"homepage": <HomePage/>,
				"projects": <Projects/>,
			} [page]
		}

		</>
	);
}

export default Menu;