import './App.css'

import LibraryPage from "./pages/LibraryPage";
import AddBookPage from "./pages/AddBookPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-4 border-b border-border flex gap-4">
          <Link to="/" className="text-primary font-bold">Library</Link>
          <Link to="/add" className="text-primary font-bold">Add Book</Link>
        </div>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/add" element={<AddBookPage />} />
        </Routes>
      </div>
    </Router>
  );
}
