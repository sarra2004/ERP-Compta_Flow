import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { CompteComptable } from '../types';
import './Comptes.css';

const Comptes = () => {
  const [comptes, setComptes] = useState<CompteComptable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CompteComptable>({
    numero: '',
    intitule: '',
    classe: '',
    type: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchComptes();
  }, []);

  const fetchComptes = async () => {
    try {
      const response = await axios.get('/comptes');
      setComptes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des comptes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/comptes', formData);
      setShowForm(false);
      setFormData({
        numero: '',
        intitule: '',
        classe: '',
        type: '',
        status: 'ACTIVE',
      });
      fetchComptes();
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="comptes-page">
      <div className="page-header">
        <h1>Plan Comptable</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouveau Compte'}
        </button>
      </div>

      {showForm && (
        <form className="compte-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Numéro</label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Intitulé</label>
              <input
                type="text"
                value={formData.intitule}
                onChange={(e) => setFormData({ ...formData, intitule: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Classe</label>
              <select
                value={formData.classe}
                onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                required
              >
                <option value="">Sélectionner</option>
                <option value="1">1 - Comptes de capitaux</option>
                <option value="2">2 - Comptes d'immobilisations</option>
                <option value="3">3 - Comptes de stocks</option>
                <option value="4">4 - Comptes de tiers</option>
                <option value="5">5 - Comptes financiers</option>
                <option value="6">6 - Comptes de charges</option>
                <option value="7">7 - Comptes de produits</option>
              </select>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Sélectionner</option>
                <option value="DEBIT">Débit</option>
                <option value="CREDIT">Crédit</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-submit">Créer le compte</button>
        </form>
      )}

      <div className="comptes-table">
        <table>
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Intitulé</th>
              <th>Classe</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {comptes.map((compte) => (
              <tr key={compte.id}>
                <td>{compte.numero}</td>
                <td>{compte.intitule}</td>
                <td>{compte.classe}</td>
                <td>{compte.type}</td>
                <td>
                  <span className={`status ${compte.status.toLowerCase()}`}>
                    {compte.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comptes;
