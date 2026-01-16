import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from "./pages/AppNavbar";




function App() {
  return (
    <BrowserRouter>
    <AppNavbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
