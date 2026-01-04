import { useEffect, useState } from 'react';
import axios from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    comptesCount: 0,
    entriesCount: 0,
    facturesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [comptes, entries, factures] = await Promise.all([
          axios.get('/comptes'),
          axios.get('/journal-entries'),
          axios.get('/factures'),
        ]);
        
        setStats({
          comptesCount: comptes.data.length,
          entriesCount: entries.data.length,
          facturesCount: factures.data.length,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Plan Comptable</h3>
          <p className="stat-number">{stats.comptesCount}</p>
          <p className="stat-label">Comptes</p>
        </div>
        <div className="stat-card">
          <h3>Écritures Comptables</h3>
          <p className="stat-number">{stats.entriesCount}</p>
          <p className="stat-label">Écritures</p>
        </div>
        <div className="stat-card">
          <h3>Factures</h3>
          <p className="stat-number">{stats.facturesCount}</p>
          <p className="stat-label">Factures</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
