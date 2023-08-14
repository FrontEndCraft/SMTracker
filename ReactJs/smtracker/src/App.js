import Index from "./Pages/Index";
import Stock from "./Pages/Stock";
import Converter from "./Pages/Converter";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
function App() {
  return (
    <div className="App">
        <Router>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/stock" element={<Stock />} />
                    <Route path="/converter" element={<Converter />} />
                </Routes>
        </Router>
    </div>
  );
}

export default App;
