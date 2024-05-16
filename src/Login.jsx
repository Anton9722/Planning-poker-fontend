import { useState } from "react";

function Login() {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => setInput((values) => ({ ...values, [event.target.name]: event.target.value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("")
            .then((res) => res.json())
            .then((data) => {});
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
