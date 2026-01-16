import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { getToken, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const token = getToken();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:5000/api/notes", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotes(res.data);
  };

  const addNote = async () => {
    await axios.post(
      "http://localhost:5000/api/notes",
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotes();
  };

   const handleLogout = () => {
      logout();
      navigate("/login");
    };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col><h3>My Notes</h3></Col>
        <Col className="text-end">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Control
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button className="w-100" onClick={addNote}>
                  Add Note
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {notes.map((note) => (
        <Card key={note._id} className="mb-2">
          <Card.Body>
            <Row>
              <Col>
                <h5>{note.title}</h5>
                <p>{note.content}</p>
              </Col>
              <Col className="text-end">
                <Button
                  variant="outline-danger"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
