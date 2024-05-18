import './App.css'
import Login from './Login';
import Register from './Register'
import Project from './Project'
import Home from './Home';
import { useEffect, useState } from 'react'

function App() {
    const [page, setPage] = useState("");
    const [project, setProject] = useState("");

    useEffect(() => {
        if (localStorage.getItem("sessionID") == undefined || localStorage.getItem("id") == undefined || localStorage.getItem("sessionID") == "") {
            setPage("login");
        } else if (localStorage.getItem("sessionID") !== "" && localStorage.getItem("sessionID") != undefined) {
            setPage("home");
        }
    }, []);


    return (
        <div>
            {
                {
                    "login": <Login setPage={setPage} />,
                    "register": <Register setPage={setPage} />,
                    "home": < Home setPage={setPage} page={page} setProject={setProject}/>,
                    "project": <Project setPage={setPage} project={project}/>,
                }[page]
            }
        </div>
    );
}

export default App;
