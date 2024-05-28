import { useState } from "react";

function Register({setPage}) {
    const [input, setInput] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
    });

    const handleChange = (event) => setInput((values) => ({ ...values, [event.target.name]: event.target.value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.password == input.passwordConfirm) {
            fetch("https://octopus-app-wyxkd.ondigitalocean.app/user/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: input.username,
                    password: input.password,
                }),
            })
                .then((res) => {
                    if(res.status === 409) {
                        alert("Användarnamnet är upptaget")
                    } else {
                        alert("Ny användare skapad")
                        setPage("login")
                    }
                })
        } else {
            alert("Lösenorden stämmer inte överens. Försök igen!");
        }
    };

    const handleClick = () => {
        setPage("login")
    }

    return (
        <form onSubmit={handleSubmit} class="login-and-reg-form">
            <label class="login-and-reg-form-label">Skapa Konto</label>
            <input placeholder="Ange användarnamn..." value={input.username} name="username" onChange={handleChange} minLength={5} maxLength={64} class="login-and-reg-input" required></input>
            <input placeholder="Ange lösenord..." value={input.password} name="password" onChange={handleChange} minLength={5} maxLength={64} class="login-and-reg-input" required></input>
            <input placeholder="Bekräfta lösenord..." value={input.passwordConfirm} name="passwordConfirm" onChange={handleChange} minLength={5} maxLength={64} class="login-and-reg-input" required></input>
            <button type="submit" class="login-and-red-btn">Bli medlem</button>
            <p>Har du redan ett konto? <a onClick={handleClick} class="link-between-log-and-reg">Logga in här</a></p>
        </form>
    );
}

export default Register;
