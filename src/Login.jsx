import { useState } from "react";

function Login({setPage}) {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => setInput((values) => ({ ...values, [event.target.name]: event.target.value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        })
        .then(res => {
            if (res.status === 400) {
                alert("ogiltigt användarnamn")
            } else if (res.status === 401) {
                alert("ogiltigt lösenord")
            } else if (res.status === 200) {
                return res.json()
            } else {
                throw new Error("error " + res.status)
            }
        })
        .then(data => {
            localStorage.setItem("id", data.id)
            localStorage.setItem("sessionID", data.sessionId)
            setPage("home")
        })
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Användarnamn</label>
            <input placeholder="Ange användarnamn..." value={input.username} name="username" onChange={handleChange} minLength={5} maxLength={64} required></input>
            <label>Lösenord</label>
            <input placeholder="Ange lösenord..." value={input.password} name="password" onChange={handleChange} type="password" minLength={5} maxLength={64} required></input>
            <button type="submit">Logga in</button>
        </form>
    );
}

export default Login;
