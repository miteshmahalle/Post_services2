import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { RootState } from "../store";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <nav className="navbar navbar-light bg-light">
      <span className="navbar-brand">BRSR</span>
      {token ? (
        <button
          className="btn btn-outline-danger"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      ) : (
        <a href="/login" className="btn btn-outline-primary">
          Login
        </a>
      )}
    </nav>
  );
};

export default Navbar;
