import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';

function Home(props) {

	const [newProjectName, setNewProjectName] = useState("");

	useEffect(() => {
		fetch("http://localhost:8080/user/get-projectList", { 
			method: "GET",
			headers: {
				"id": localStorage.getItem("id"),
				"sessionID": localStorage.getItem("sessionID")
			}
		})
			.then(res => res.text())
			.then(data => {
				if (data === "Unauthorized: User authentication failed") {
					console.log("Unauthorized: User authentication failed");
					props.setPage("login");
				} else {
					data = JSON.parse(data);
					if (data.length == 0) {
						let h3 = document.createElement("h3");
						document.getElementById("cardsDiv").innerHTML = "";
						h3.textContent = "Inga projekt";
						document.getElementById("cardsDiv").appendChild(h3)
					} else {
						document.getElementById("cardsDiv").innerHTML = "";
						for (let i = 0; i < data.length; i++) {
							const projectDiv = document.createElement("div");
							projectDiv.style.borderStyle = "solid";
							projectDiv.style.borderWidth = "2px";
							const projecth4 = document.createElement("h4");
							projectDiv.appendChild(projecth4);
							projecth4.innerHTML = data[i].projectName;
							projectDiv.addEventListener("click", () => {
								props.setProject(data[i].projectID);
								props.setPage("project");
							})
							document.getElementById("cardsDiv").appendChild(projectDiv);

						}

					}
				}
			})
	}, [newProjectName])

	const createNewProject = () => {
		console.log(document.getElementById("newProjectInputField").value);


		fetch("http://localhost:8080/project/create", { 
			method: "POST",
			headers: {
				"id": localStorage.getItem("id"),
				"sessionID": localStorage.getItem("sessionID"),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"name": document.getElementById("newProjectInputField").value
			}),
		})
			.then(res => res.text())
			.then(data => {
				if (data === "Unauthorized: User authentication failed") {
					console.log("Unauthorized: User authentication failed");
					props.setPage("login");
				} else {
					data = JSON.parse(data);
					setNewProjectName(document.getElementById("newProjectInputField").value);
				}
			})
	}

	return (
		<div>
			<h1>HomePage</h1>
			<Menu setPage={props.setPage} page={props.page} />
			<input type="text" placeholder='Nytt projekt' id="newProjectInputField" />
			<button onClick={() => { createNewProject() }}>Skapa nytt projekt</button>
			<div id="cardsDiv"></div>
		</div>
	);
}

export default Home;