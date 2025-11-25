import { useEffect, useState } from "react";

export default function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
  });
  const [editingId, setEditingId] = useState(null);
  const API_URL = "http://localhost:3000/books";
  useEffect(() => {
    fetchBooks();
  }, []);

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
}
