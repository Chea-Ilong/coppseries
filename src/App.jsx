import "./App.css";
import Navbar from "./components/Navbar"; // Import Navbar

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <>
      <Navbar />
    </>
  );
}
