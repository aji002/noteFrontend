import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, logout } from "../api/auth";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = getToken();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(res.data);
    } catch (err) {
      
      logout();
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">NotesApp</Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {!token ? (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          ) : (
            <>
              {user && (
                <div className="text-white me-3 text-end">
                  <div className="fw-bold">{user.name}</div>
                  <small>{user.email}</small>
                </div>
              )}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
