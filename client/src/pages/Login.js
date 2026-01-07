import axios from "../api/axios";

export default function Login() {
  const login = async () => {
    const res = await axios.post("/auth/login", {
      email: "test@test.com",
      password: "password"
    });
    localStorage.setItem("token", res.data.token);
  };

  return <button onClick={login}>Login</button>;
}
