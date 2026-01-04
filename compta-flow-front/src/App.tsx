import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Comptes from './pages/Comptes';
import JournalEntries from './pages/JournalEntries';
import Factures from './pages/Factures';
import Periods from './pages/Periods';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="comptes" element={<Comptes />} />
          <Route path="journal-entries" element={<JournalEntries />} />
          <Route path="factures" element={<Factures />} />
          <Route path="periods" element={<Periods />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
