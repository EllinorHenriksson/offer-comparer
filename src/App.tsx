import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OfferDetails from "./pages/OfferDetails";
import Offers from "./pages/Offers";
import Upload from "./pages/Upload";
import Compare from "./pages/Compare";
import PageNotFound from "./pages/PageNotFound";
import Navbar from "./parts/Navbar";
import { useState } from "react";

function App() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload files={files} setFiles={setFiles} />} />
            <Route path="/offers/:id/*" element={<OfferDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </BrowserRouter>   
    </div>
  );
}

export default App;
