import './App.css'

import LibraryPage from "./pages/LibraryPage";
import AddBookPage from "./pages/AddBookPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="overflow-x-auto container mx-auto max-w-6xl pb-8 text-center">
        <div className="p-4 border-b flex gap-4">
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
