import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Products</Link> |{" "}
      <Link to="/cart">Cart</Link> |{" "}
      <Link to="/orders">Orders</Link>
    </nav>
  );
}
