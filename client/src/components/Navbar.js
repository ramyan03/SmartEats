import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Products</Link>
      <Link to="/cart">Cart</Link>

      {user ? (
        <>
          <Link to="/orders">Orders</Link>
          <span style={{ marginLeft: "auto" }}>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span style={{ marginLeft: "auto" }}>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </span>
      )}
    </nav>
  );
}
