import { useState } from "react";

function Register() {
    const [input, setInput] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
    });

    const handleChange = (event) => setInput((values) => ({ ...values, [event.target.name]: event.target.value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.password == input.passwordConfirm) {
            fetch("", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: input.username,
                    password: input.password,
                }),
            })
                .then((res) => res.json())
                .then(() => {});
        } else {
            alert("Lösenorden stämmer inte överens. Försök igen!");
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <label>Användarnamn</label>
            <input placeholder="Ange användarnamn..." value={input.username} name="username" onChange={handleChange} minLength={5} maxLength={64} required></input>
            <label>Lösenord</label>
            <input placeholder="Ange lösenord..." value={input.password} name="password" onChange={handleChange} minLength={5} maxLength={64} required></input>
            <label>Bekräfta lösenord</label>
            <input placeholder="Bekräfta lösenord..." value={input.passwordConfirm} name="passwordConfirm" onChange={handleChange} minLength={5} maxLength={64} required></input>
            <button type="submit">Bli medlem</button>
        </form>
    );
}

export default Register;
