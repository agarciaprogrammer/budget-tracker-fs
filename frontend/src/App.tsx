import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
//import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
//import Incomes from './pages/Incomes';
import Login from './pages/Login';
//import FixedExpenses from './pages/FixedExpenses';
import Layout from './layouts/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register />} />  
        
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/expenses" element={<Expenses />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/incomes" element={<Incomes />} /> */}
          {/* <Route path="/fixed-expenses" element={<FixedExpenses />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;