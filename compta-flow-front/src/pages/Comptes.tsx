import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { CompteComptable } from '../types';
import './Comptes.css';

const Comptes = () => {
  const [comptes, setComptes] = useState<CompteComptable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
      if (editingId) {
        // Modification
        await axios.put(`/comptes/${editingId}`, formData);
      } else {
        // Création
        await axios.post('/comptes', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        numero: '',
        intitule: '',
        classe: '',
        type: '',
        status: 'ACTIVE',
      });
      fetchComptes();
    } catch (error) {
      const message = (error as any)?.response?.data || `Erreur lors de ${editingId ? 'la modification' : 'la création'} du compte`;
      console.error('Erreur:', message);
      alert(message);
    }
  };

  const handleEdit = (compte: CompteComptable) => {
    setEditingId(compte.id || null);
    setFormData({
      numero: compte.numero,
      intitule: compte.intitule,
      classe: compte.classe,
      type: compte.type,
      status: compte.status,
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      numero: '',
      intitule: '',
      classe: '',
      type: '',
      status: 'ACTIVE',
    });
  };

  const handleDisable = async (id: number | undefined) => {
    if (!id) return;
    const confirmDisable = window.confirm('Confirmer la désactivation de ce compte comptable ?');
    if (!confirmDisable) return;
    try {
      await axios.patch(`/comptes/${id}/disable`);
      fetchComptes();
      alert('Compte désactivé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la désactivation du compte:', error);
      const errorData = (error as any)?.response?.data;
      const message = typeof errorData === 'string' ? errorData : 'La désactivation a échoué.';
      alert(message);
    }
  };

  const handleActivate = async (id: number | undefined) => {
    if (!id) return;
    const confirmActivate = window.confirm('Confirmer la réactivation de ce compte comptable ?');
    if (!confirmActivate) return;
    try {
      await axios.patch(`/comptes/${id}/activate`);
      fetchComptes();
      alert('Compte activé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la réactivation du compte:', error);
      const errorData = (error as any)?.response?.data;
      const message = typeof errorData === 'string' ? errorData : 'La réactivation a échoué.';
      alert(message);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    const confirmDelete = window.confirm('Confirmer la suppression de ce compte comptable ?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/comptes/${id}`);
      fetchComptes();
      alert('Compte supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      const errorData = (error as any)?.response?.data;
      const message = typeof errorData === 'string' ? errorData : "La suppression a échoué. Vérifiez que le compte n'est pas utilisé.";
      alert(message);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="comptes-page">
      <div className="page-header">
        <h1>Plan Comptable</h1>
        <button className="btn-primary" onClick={() => showForm ? handleCancelEdit() : setShowForm(true)}>
          {showForm ? 'Annuler' : 'Nouveau Compte'}
        </button>
      </div>

      {showForm && (
        <form className="compte-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Modifier le compte' : 'Nouveau compte'}</h3>
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
          <button type="submit" className="btn-submit">{editingId ? 'Modifier' : 'Créer le compte'}</button>
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
              <th>Actions</th>
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
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(compte)}
                    >
                      Modifier
                    </button>
                    {compte.status === 'ACTIVE' ? (
                      <button
                        className="btn-warning"
                        onClick={() => handleDisable(compte.id)}
                      >
                        Désactiver
                      </button>
                    ) : (
                      <button
                        className="btn-success"
                        onClick={() => handleActivate(compte.id)}
                      >
                        Activer
                      </button>
                    )}
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(compte.id)}
                    >
                      Supprimer
                    </button>
                  </div>
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
