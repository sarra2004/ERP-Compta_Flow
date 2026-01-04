import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { AccountingPeriod } from '../types';
import './Periods.css';

const Periods = () => {
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AccountingPeriod>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    status: 'OUVERT',
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
    try {
      await axios.post('/periods', formData);
      setShowForm(false);
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        status: 'OUVERT',
      });
      fetchPeriods();
    } catch (error) {
      console.error('Erreur lors de la création de la période:', error);
    }
  };

  const handleClosePeriod = async (id: number | undefined) => {
    if (!id) return;
    try {
      await axios.post(`/periods/${id}/close`);
      fetchPeriods();
    } catch (error) {
      console.error('Erreur lors de la clôture de la période:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="periods-page">
      <div className="page-header">
        <h1>Périodes Comptables</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouvelle Période'}
        </button>
      </div>

      {showForm && (
        <form className="period-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Année</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
          </div>
          <button type="submit" className="btn-submit">Créer la période</button>
        </form>
      )}

      <div className="periods-table">
        <table>
          <thead>
            <tr>
              <th>Année</th>
              <th>Mois</th>
              <th>Statut</th>
              <th>Date de clôture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id}>
                <td>{period.year}</td>
                <td>{getMonthName(period.month)}</td>
                <td>
                  <span className={`status ${((period as any).status || 'OPEN').toLowerCase()}`}>
                    {(period as any).status === 'OPEN' ? 'OUVERT' : ((period as any).status || period.status)}
                  </span>
                </td>
                <td>{formatDate((period as any).closingDate || period.closedDate)}</td>
                <td>
                  {((period as any).status === 'OPEN' || period.status === 'OUVERT') && (
                    <button
                      onClick={() => handleClosePeriod(period.id)}
                      className="btn-danger"
                    >
                      Clôturer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Periods;
