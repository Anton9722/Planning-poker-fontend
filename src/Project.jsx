import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';

function Project(props) {

	const [projectData, setProjectData] = useState("");
	const [listOfUsers, setListOfUsers] = useState("");

	useEffect(() => {
		loadPage();
	},[])

	const loadPage = () => {
		fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/" + props.project, {
			method: "GET",
			headers: {
				"userId": localStorage.getItem("id"),
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
					setProjectData(data);
					document.getElementById("membersDiv").innerHTML = "";
					const obj = {};
					if(data.creatorId != localStorage.getItem("id")) {
                        document.getElementById("deleteProjectButton").disabled = true;
                    }
					for (let i = 0; i < data.memberList.length; i++) {
						const h5 = document.createElement("h5");
						h5.classList.add("members-names")
						h5.innerHTML = data.memberList[i].username;
						document.getElementById("membersDiv").appendChild(h5);
						//skapar map av användare för att skapa issue.estimatedtimes
						obj[data.memberList[i].userId] = null;
						if (localStorage.getItem("id") == data.creatorId && localStorage.getItem("id") != data.memberList[i].userId) { //skapar raderaknapp ifall man är ägaren av projektet
							const deleteButton = document.createElement("button");
							deleteButton.textContent = "Ta bort " + data.memberList[i].username;
							deleteButton.addEventListener("click", () => {
								fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/removemember", {
									method: "DELETE",
									headers: {
										"projectId": props.project,
										"userId": localStorage.getItem("id"),
										"sessionId": localStorage.getItem("sessionID"),
										"usernameToRemove": data.memberList[i].username,
										"userIdToRemove": data.memberList[i].userId
									}
								})
									.then(res => res.text())
									.then(data => {
				
										loadPage();
									})
							})
							document.getElementById("membersDiv").appendChild(deleteButton);
						}
					}
					setListOfUsers(obj);
				}
			})
		document.getElementById("fieldsDiv").style.borderStyle = "solid";
		document.getElementById("fieldsDiv").style.borderWidth = "2px";
		fetchData();
	}

	const deleteProject = () => {
		fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/delete", {
			method: "DELETE",
			headers: {
				"projectId": props.project,
				"userId": localStorage.getItem("id"),
				"sessionId": localStorage.getItem("sessionID")
			}
		})
			.then(res => res.text())
			.then(data => {
					
				props.setPage("home")
			})
	}

	const addMemberToProject = () => {
		fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/addmember", {
			method: "PUT",
			headers: {
				"projectId": props.project,
				"userId": localStorage.getItem("id"),
				"sessionId": localStorage.getItem("sessionID"),
				"usernameToAdd": document.getElementById("memberUsernameField").value
			}
		})
			.then(res => res.text())
			.then(data => {
					
				loadPage();
			})
	}

	const addIssueToProject = () => {
		fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/issue", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"userId": localStorage.getItem("id"),
				"sessionId": localStorage.getItem("sessionID")
			},
			body: JSON.stringify({
				projectId: props.project,
				creatorId: localStorage.getItem("id"),
				name: document.getElementById("newIssueNameField").value,
				estimatedTimes: listOfUsers
			}),
		})
			.then(res => res.text())
			.then(data => {
				//!!!!!!!!!1felhantering
				loadPage();
			})
	}


	//------------------------------METOD FÖR ATT HÄMTA OCH RITA UT ISSUES--------------------------------------
	const fetchData = () => {
		fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/" + props.project + "/issues", {
			method:"GET",
			headers: {
				"userId": localStorage.getItem("id"),
				"sessionId": localStorage.getItem("sessionID")
			}
		})
		.then(res => {
			if(res.status == 404) {
				
			}
			if(res.status == 200) {
				return res.json()
			}
		})
		.then(data => {

			document.getElementById("issue-container").innerHTML = ""; 

			data.forEach(issue => {
				
				let issueContainer = document.getElementById("issue-container")
				let issueDiv = document.createElement("div")
				issueDiv.classList.add("issueDiv")

				issueDiv.innerHTML = issue.name
				issueContainer.appendChild(issueDiv)
				
				let boxContainer = document.createElement("div")
				boxContainer.classList.add("box-container")
				for(let key in issue.estimatedTimes){

					
					//hämta username för att använda för mouseover/mouseout
					let username = "";
					fetch("https://octopus-app-wyxkd.ondigitalocean.app/user/get-username-from-id", {
						method: "GET",
						headers: {
							"id": key
						}
					})
					.then(res => res.text())
					.then(data => {
						username = data
						if(issue.estimatedTimes[key] === false){

							
							if(key == localStorage.getItem("id")){

								let inputContainer = document.createElement("div")
								inputContainer.classList.add("input-container")
								
								let timeEstimateInput = document.createElement("input")
								timeEstimateInput.id = "time-estimate-input"
								timeEstimateInput.placeholder = "Timmar"
								timeEstimateInput.type = "number"
								timeEstimateInput.min = "0"
	
								let timeEstimateBtn = document.createElement("button")
								timeEstimateBtn.id = "time-estimate-btn"
								timeEstimateBtn.innerHTML = "Spara tidsestimering"

								let inputTitle = document.createElement("h4")
								inputTitle.innerHTML = "Ange din estimering"
								inputTitle.style.marginTop = "0px"
								inputTitle.style.marginBottom = "5px"

								inputContainer.appendChild(inputTitle)
								inputContainer.appendChild(timeEstimateInput)
								inputContainer.appendChild(timeEstimateBtn)
								issueDiv.appendChild(inputContainer)
	
								timeEstimateBtn.addEventListener("click", function() {
	
									if(timeEstimateInput.value === "") {
	
										alert("Du måste ange en tid")
	
									} else {
	
										let timeEstimate = parseInt(timeEstimateInput.value)
	
										fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/issue/assign-estimated-time/" + issue.id, {
											method:"PATCH",
											headers: {
												"userId": localStorage.getItem("id"),
												"sessionId": localStorage.getItem("sessionID"),
												"estimatedTime": timeEstimate
											}
										})
										.then(res => res.text())
										.then(data => { 
											loadPage();
										})
									}
								})
								
							} else {
	
								let falseEstimatedTimeCube = document.createElement("div")
								falseEstimatedTimeCube.style.width = "45px"
								falseEstimatedTimeCube.style.height = "45px"
								falseEstimatedTimeCube.style.marginLeft = "15px"
								falseEstimatedTimeCube.style.marginRight = "15px"
								falseEstimatedTimeCube.style.backgroundColor = "red"
								falseEstimatedTimeCube.innerHTML = "?"

								let tooltip = document.createElement("span")
								tooltip.innerHTML = username
								tooltip.classList.add("tooltip")
								tooltip.style.display = "none"

								falseEstimatedTimeCube.appendChild(tooltip)
								boxContainer.appendChild(falseEstimatedTimeCube)
								issueDiv.appendChild(boxContainer)

								falseEstimatedTimeCube.addEventListener("mouseover", () => {
									tooltip.style.display = "block"
								})
		
								falseEstimatedTimeCube.addEventListener("mouseout", () => {
									tooltip.style.display = "none"
								})
	
							}
							
						} else if(issue.estimatedTimes[key] === true) {
							
							let trueEstimatedTimeCube = document.createElement("div")
							trueEstimatedTimeCube.innerHTML = "?"
							trueEstimatedTimeCube.classList.add("show-username")
	
							let tooltip = document.createElement("span")
							tooltip.innerHTML = username
							tooltip.classList.add("tooltip")
							tooltip.style.display = "none"
	
							trueEstimatedTimeCube.appendChild(tooltip)
							boxContainer.appendChild(trueEstimatedTimeCube)
							issueDiv.appendChild(boxContainer)

							trueEstimatedTimeCube.addEventListener("mouseover", () => {
								tooltip.style.display = "block"
							})
	
							trueEstimatedTimeCube.addEventListener("mouseout", () => {
								tooltip.style.display = "none"
							})
							
							
						} else if(Number.isInteger(issue.estimatedTimes[key])) {
							
							let showEstimatedTimeCube = document.createElement("div")
							showEstimatedTimeCube.innerHTML = issue.estimatedTimes[key]
							showEstimatedTimeCube.classList.add("show-username")
							
							let tooltip = document.createElement("span")
							tooltip.innerHTML = username
							tooltip.classList.add("tooltip")
							tooltip.style.display = "none"
	
							
							showEstimatedTimeCube.appendChild(tooltip)
							boxContainer.appendChild(showEstimatedTimeCube)
							issueDiv.appendChild(boxContainer)
	
							showEstimatedTimeCube.addEventListener("mouseover", () => {
								tooltip.style.display = "block"
							})
	
							showEstimatedTimeCube.addEventListener("mouseout", () => {
								tooltip.style.display = "none"
							})
	
						}
					})
				}
					

				if(issue.assignedId === null){
					let assignBtn = document.createElement("button")
					assignBtn.style.width = "100px"
					assignBtn.style.height = "35px"
					assignBtn.innerHTML = "assign"
					issueDiv.appendChild(assignBtn)

					assignBtn.addEventListener("click", function(){
						//ändra från assignedIds till assignedId i issueprojects
						fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/issue/assign-member/" + issue.id, {
							method:"PATCH",
							headers: {
								"userId": localStorage.getItem("id"),
								"sessionId": localStorage.getItem("sessionID")
							}
						})
							.then(res => res.text())
							.then(data => { 
								loadPage();
							})

					})

				} else {
					let usernameAssigned = document.createElement("h4")
                    usernameAssigned.id = "usernameAssigned";
                    usernameAssigned.classList.add("usernameAssigned")
                    fetch("https://octopus-app-wyxkd.ondigitalocean.app/user/get-username-from-id", {
                        method: "GET",
                        headers: {
                            "id": issue.assignedId
                        }
                    })
                    .then(res => res.text())
                    .then(data => {
                        usernameAssigned.innerHTML = "issue tilldelat: " + data
                        issueDiv.appendChild(usernameAssigned)
					let counterForCompletedTimeValidation = 0;
                        for(let key in issue.estimatedTimes){ 
                            if (Number.isInteger(issue.estimatedTimes[key]) && issue.assignedId == localStorage.getItem("id")) {
                                counterForCompletedTimeValidation++;
                            }
							if (counterForCompletedTimeValidation == Object.keys(issue.estimatedTimes).length && issue.completedTime == null) {
                                usernameAssigned.remove();
                                let completedTimeInputField = document.createElement("input");
                                completedTimeInputField.type = "text";
                                completedTimeInputField.placeholder = "Färdiga tiden här"
                                let submitCompletedTimeButton = document.createElement("button");
                                submitCompletedTimeButton.textContent = "Spara färdig tid"
                                submitCompletedTimeButton.addEventListener("click", () => {
									fetch("https://octopus-app-wyxkd.ondigitalocean.app/project/issue/close/" + issue.id, {
                                        method: "PATCH",
                                        headers: {
                                            "userId": localStorage.getItem("id"),
                                            "sessionId": localStorage.getItem("sessionID"),
                                            "completedTime": completedTimeInputField.value
                                        }
                                    })
									.then(res => res.text())
                                        .then(data => { 
                                            loadPage();
                                        })
									})
									issueDiv.appendChild(completedTimeInputField);
									issueDiv.appendChild(submitCompletedTimeButton)
								}
							}
					})
						
				}
				boxContainer.classList.add("box-container")

				let completedTimeBox = document.createElement("div")
				completedTimeBox.style.height = "80px"
				completedTimeBox.style.width = "80px"

				if(issue.completedTime === null) {

					completedTimeBox.innerHTML = "?"
					completedTimeBox.style.backgroundColor = "grey"
					boxContainer.appendChild(completedTimeBox)
					issueDiv.appendChild(boxContainer)
					
				} else {
					
					completedTimeBox.innerHTML = issue.completedTime
					completedTimeBox.style.backgroundColor = "green"
					boxContainer.appendChild(completedTimeBox)
					issueDiv.appendChild(boxContainer)
					
				}
				
			})
		})
	}
	//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ METOD FÖR ATT HÄMTA OCH RITA UT ISSUES ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	
	return (
		<div>
			<Menu setPage={props.setPage} page={props.page}/>
			<h1>{projectData.name}</h1>
			<h4>Medlemmar</h4>
			<div id='membersDiv'></div>
			<div id='fieldsDiv'>
				<input class="add-userAndIssue-input" type="text" id='memberUsernameField' placeholder='Lägg till en användare till projektet'/>
				<button class="add-userAndIssue-btn" onClick={() => addMemberToProject()}>Lägg till användare</button>
				<br />
				<input class="add-userAndIssue-input" type="text" id='newIssueNameField' placeholder='Lägg till ett issue till projektet'/>
				<button class="add-userAndIssue-btn" onClick={() => addIssueToProject()}>Lägg till issue</button>
			</div>
			<br />
			<h3>Issues</h3>
			<div id="issue-container"></div>
			<button id='deleteProjectButton' onClick={()=>deleteProject()}>Radera projekt</button>
		</div>
	);
}

export default Project;