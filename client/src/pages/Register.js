import axios from "../api/axios";

export default function Register() {
  const register = async () => {
    await axios.post("/auth/register", {
      email: "test@test.com",
      password: "password"
    });
  };

  return <button onClick={register}>Register</button>;
}
