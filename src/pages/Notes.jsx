import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { getToken, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  
  const [search, setSearch] = useState("");

  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate("/login");
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
    if (!title || !content) return;

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

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const updateNote = async (id) => {
    await axios.put(
      `http://localhost:5000/api/notes/${id}`,
      { title: editTitle, content: editContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingId(null);
    fetchNotes();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col><h3>My Notes</h3></Col>
        <Col md={4}>
          <Form.Control
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        {/* <Col className="text-end">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Col> */}
      </Row>

      
      <Card className="mb-4">
        <Card.Body>
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
        </Card.Body>
      </Card>

      
      {filteredNotes.length === 0 && (
        <p className="text-muted text-center">No notes found</p>
      )}

      {filteredNotes.map((note) => (
        <Card key={note._id} className="mb-2">
          <Card.Body>
            {editingId === note._id ? (
              <>
                <Form.Control
                  className="mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Form.Control
                  className="mb-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => updateNote(note._id)}
                >
                  Save
                </Button>{" "}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Row>
                <Col>
                  <h5>{note.title}</h5>
                  <p>{note.content}</p>
                </Col>
                <Col className="text-end">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => startEdit(note)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteNote(note._id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
