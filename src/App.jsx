import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import Section from "./components/section";
import Footer from "./components/footer";
import ProductOverview from "./components/productOverview";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Carousel />
            <Section />
          </>
        } />
        <Route path="/product/:id" element={<ProductOverview />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}