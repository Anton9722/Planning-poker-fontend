import { useState } from "react";

function Login({setPage}) {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => setInput((values) => ({ ...values, [event.target.name]: event.target.value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("https://octopus-app-wyxkd.ondigitalocean.app/user/login", {
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

    const handleClick = () => {
        setPage("register")
    }

    return (
        <form onSubmit={handleSubmit} class="login-and-reg-form">
            <label class="login-and-reg-form-label">Logga In</label>
            <input placeholder="Användarnamn..." value={input.username} name="username" onChange={handleChange} minLength={5} maxLength={64} class="login-and-reg-input" required></input>
            <input placeholder="Lösenord..." value={input.password} name="password" onChange={handleChange} type="password" minLength={5} maxLength={64} class="login-and-reg-input" required></input>
            <button type="submit" class="login-and-red-btn">Logga in</button>
            <p>Har du inget konto? <a onClick={handleClick} class="link-between-log-and-reg">Skapa nytt konto här</a></p>
        </form>
    );
}

export default Login;
