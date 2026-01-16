import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { MouvementTresorerie } from '../types';
import './Tresorerie.css';

const Tresorerie = () => {
  const [mouvements, setMouvements] = useState<MouvementTresorerie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [solde, setSolde] = useState(0);
  const [formData, setFormData] = useState<MouvementTresorerie>({
    date: new Date().toISOString().split('T')[0],
    libelle: '',
    type: 'ENTREE',
    montant: 0,
    moyenPaiement: 'ESPECE',
    reference: '',
  });

  useEffect(() => {
    fetchMouvements();
  }, []);

  const fetchMouvements = async () => {
    try {
      const response = await axios.get('/tresorerie');
      setMouvements(response.data);
      calculerSolde(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculerSolde = (data: MouvementTresorerie[]) => {
    const total = data.reduce((acc, mouv) => {
      return mouv.type === 'ENTREE' 
        ? acc + (mouv.montant || 0) 
        : acc - (mouv.montant || 0);
    }, 0);
    setSolde(total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/tresorerie', formData);
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        libelle: '',
        type: 'ENTREE',
        montant: 0,
        moyenPaiement: 'ESPECE',
        reference: '',
      });
      fetchMouvements();
    } catch (error) {
      console.error('Erreur lors de la création du mouvement:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="tresorerie-page">
      <div className="page-header">
        <h1>Trésorerie</h1>
        <div className="header-actions">
          <div className={`solde-card ${solde >= 0 ? 'positive' : 'negative'}`}>
            <span className="solde-label">Solde actuel</span>
            <span className="solde-montant">{solde.toFixed(2)} DT</span>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : 'Nouveau Mouvement'}
          </button>
        </div>
      </div>

      {showForm && (
        <form className="tresorerie-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ENTREE' | 'SORTIE' })}
                required
              >
                <option value="ENTREE">Entrée</option>
                <option value="SORTIE">Sortie</option>
              </select>
            </div>
            <div className="form-group">
              <label>Moyen de paiement</label>
              <select
                value={formData.moyenPaiement}
                onChange={(e) => setFormData({ ...formData, moyenPaiement: e.target.value })}
                required
              >
                <option value="ESPECE">Espèce</option>
                <option value="CHEQUE">Chèque</option>
                <option value="VIREMENT">Virement</option>
                <option value="CARTE">Carte bancaire</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Libellé</label>
              <input
                type="text"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Montant (DT)</label>
              <input
                type="number"
                step="0.01"
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="form-group">
              <label>Référence</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="N° chèque, facture..."
              />
            </div>
          </div>
          <button type="submit" className="btn-submit">Enregistrer le mouvement</button>
        </form>
      )}

      <div className="mouvements-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Libellé</th>
              <th>Type</th>
              <th>Moyen de paiement</th>
              <th>Référence</th>
              <th>Entrée</th>
              <th>Sortie</th>
              <th>Solde</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((mouvement, index) => {
              const soldeProgressif = mouvements
                .slice(0, index + 1)
                .reduce((acc, m) => 
                  m.type === 'ENTREE' ? acc + (m.montant || 0) : acc - (m.montant || 0), 
                  0
                );
              
              return (
                <tr key={mouvement.id}>
                  <td>{new Date(mouvement.date).toLocaleDateString('fr-FR')}</td>
                  <td>{mouvement.libelle}</td>
                  <td>
                    <span className={`badge ${mouvement.type.toLowerCase()}`}>
                      {mouvement.type === 'ENTREE' ? 'Entrée' : 'Sortie'}
                    </span>
                  </td>
                  <td>{mouvement.moyenPaiement}</td>
                  <td>{mouvement.reference || '-'}</td>
                  <td className="montant-entree">
                    {mouvement.type === 'ENTREE' ? `${mouvement.montant?.toFixed(2)} DT` : '-'}
                  </td>
                  <td className="montant-sortie">
                    {mouvement.type === 'SORTIE' ? `${mouvement.montant?.toFixed(2)} DT` : '-'}
                  </td>
                  <td className={`solde-progressif ${soldeProgressif >= 0 ? 'positive' : 'negative'}`}>
                    {soldeProgressif.toFixed(2)} DT
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tresorerie;
