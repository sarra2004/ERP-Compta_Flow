import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { AccountingPeriod } from '../types';
import './Periods.css';

const Periods = () => {
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AccountingPeriod>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    status: 'OPEN',
  });

  const getMonthName = (month: number | null | undefined) => {
    if (!month) return 'Annuelle';
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1] || month;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const response = await axios.get('/periods');
      setPeriods(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des périodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/periods', formData);
      setShowForm(false);
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        status: 'OPEN',
      });
      fetchPeriods();
    } catch (error: any) {
      console.error('Erreur lors de la création de la période:', error);
      const errorMsg = error.response?.data?.error || 'Impossible de créer la période';
      setError(errorMsg);
    }
  };

  const handleClosePeriod = async (id: number | undefined) => {
    if (!id) return;
    const confirmClose = window.confirm('Êtes-vous sûr de vouloir clôturer cette période ?');
    if (!confirmClose) return;
    setError(null);
    try {
      await axios.post(`/periods/${id}/close`);
      fetchPeriods();
    } catch (error: any) {
      console.error('Erreur lors de la clôture de la période:', error);
      const errorMsg = error.response?.data?.error || 'Impossible de clôturer la période';
      setError(errorMsg);
    }
  };

  const handleReopenPeriod = async (id: number | undefined) => {
    if (!id) return;
    const confirmReopen = window.confirm('Êtes-vous sûr de vouloir rouvrir cette période ?');
    if (!confirmReopen) return;
    setError(null);
    try {
      await axios.patch(`/periods/${id}/reopen`);
      fetchPeriods();
    } catch (error: any) {
      console.error('Erreur lors de la réouverture de la période:', error);
      const errorMsg = error.response?.data?.error || 'Impossible de rouvrir la période';
      setError(errorMsg);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const periodsOuvertes = periods.filter(p => (p as any).status === 'OPEN').length;
  const periodsCloturees = periods.filter(p => (p as any).status === 'CLOSED').length;

  return (
    <div className="periods-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gestion exercices</p>
          <h1>Périodes Comptables</h1>
          <p className="subtitle">Gérez l'ouverture et la clôture de vos périodes mensuelles et annuelles.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouvelle Période'}
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <p className="label">Total périodes</p>
          <h3>{periods.length}</h3>
          <p className="hint">Exercices créés</p>
        </div>
        <div className="metric-card">
          <p className="label">Périodes ouvertes</p>
          <h3>{periodsOuvertes}</h3>
          <p className="hint">Saisies autorisées</p>
        </div>
        <div className="metric-card">
          <p className="label">Périodes clôturées</p>
          <h3>{periodsCloturees}</h3>
          <p className="hint">Verrouillées</p>
        </div>
        <div className="metric-card">
          <p className="label">Exercice en cours</p>
          <h3>{new Date().getFullYear()}</h3>
          <p className="hint">Année active</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {showForm && (
        <form className="period-form" onSubmit={handleSubmit}>
          <h3>Nouvelle période comptable</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Année</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                placeholder="Ex: 2026"
                required
              />
            </div>
            <div className="form-group">
              <label>Mois</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                required
              >
                <option value="1">Janvier</option>
                <option value="2">Février</option>
                <option value="3">Mars</option>
                <option value="4">Avril</option>
                <option value="5">Mai</option>
                <option value="6">Juin</option>
                <option value="7">Juillet</option>
                <option value="8">Août</option>
                <option value="9">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
            <div className="form-group">
              <label>Statut initial</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="OPEN">Ouverte</option>
                <option value="CLOSED">Clôturée</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-submit">Créer la période</button>
        </form>
      )}

      <div className="periods-table">
        <div className="table-header">
          <h2>Liste des périodes</h2>
          <div className="legend">
            <span className="status-pill ouvert">Ouverte</span>
            <span className="status-pill cloture">Clôturée</span>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Année</th>
              <th>Mois</th>
              <th>Période</th>
              <th>Statut</th>
              <th>Date de clôture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">Aucune période comptable créée</td>
              </tr>
            ) : (
              periods.map((period) => {
                const statut = (period as any).status || period.status;
                const isOpen = statut === 'OPEN';
                return (
                  <tr key={period.id}>
                    <td><strong>{period.year}</strong></td>
                    <td>{getMonthName(period.month)}</td>
                    <td>{period.month ? `${period.month}/${period.year}` : `Annuelle ${period.year}`}</td>
                    <td>
                      <span className={`status ${isOpen ? 'ouvert' : 'cloture'}`}>
                        {isOpen ? '🟢 Ouverte' : '🔴 Clôturée'}
                      </span>
                    </td>
                    <td>{formatDate((period as any).closingDate || period.closedDate)}</td>
                    <td className="action-buttons">
                      {isOpen && (
                        <button
                          onClick={() => handleClosePeriod(period.id)}
                          className="btn-cloturer"
                          title="Clôturer cette période"
                        >
                          🔒 Clôturer
                        </button>
                      )}
                      {!isOpen && (
                        <button
                          onClick={() => handleReopenPeriod(period.id)}
                          className="btn-reopen"
                          title="Rouvrir cette période"
                        >
                          🔓 Rouvrir
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Periods;
