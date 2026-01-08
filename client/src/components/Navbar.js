import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);

  const count = items.reduce((s, it) => s + (it.quantity || 0), 0);

  return (
    <div className="nav">
      <div className="navInner">
        <div className="brand">Ramyan's Restaurant</div>

        <Link className="pill" to="/">Products</Link>
        <Link className="pill" to="/cart">Cart <span className="badge">{count}</span></Link>

        <div className="right">
          {user ? (
            <>
              <Link className="pill" to="/orders">Orders</Link>
              <span className="muted">{user.email}</span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="pill" to="/login">Login</Link>
              <Link className="pill" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
