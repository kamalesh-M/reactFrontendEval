import './App.css';
import Home from "./home";
import Dashboard from './dashboard';
import {BrowserRouter,Routes,Route} from "react-router-dom"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
        <Route></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;