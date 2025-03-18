import "./App.css";
import Navbar from "./navbar"; // Import Navbar

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
