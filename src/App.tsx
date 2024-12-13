import React from "react";
import ProductPicker from "./components/ProductPicker/ProductPicker";
import Navbar from "./components/Navbar";
import { ProductProvider } from "./store/Context";

function App() {
  return (
    <ProductProvider>
      <div className="App">
        <Navbar />
        <ProductPicker />
      </div>
    </ProductProvider>
  );
}

export default App;
