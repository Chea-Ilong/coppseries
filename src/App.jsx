import "./App.css";
import "./styles/theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Carousel from "./components/carousel";
import Section from "./components/section";
import Footer from "./components/footer";
import ProductOverview from "./components/productOverview";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/auth/login";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                <>
                  <Carousel />
                  <Section />
                </>
              } />
              <Route path="/product/:id" element={<ProductOverview />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}