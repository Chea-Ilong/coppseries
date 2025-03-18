import "./App.css";
import Navbar from "./components/navbar"; 
import Carousel from "./components/carousel";
import Section from "./components/section"; 

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <>
      <Navbar />
      <Carousel />
      <Section />
    </>
  );
}
