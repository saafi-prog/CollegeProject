import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Eleves from "./pages/Eleves";
import Professeurs from "./pages/Professeurs";
import Notes from "./pages/Notes";
import Classes from "./pages/Classes";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/eleves" element={<Eleves />} />
        <Route path="/professeurs" element={<Professeurs />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/classes" element={<Classes />} />
      </Route>
    </Routes>
  );
}