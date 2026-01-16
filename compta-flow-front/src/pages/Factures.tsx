import { useEffect, useMemo, useState } from 'react';
import axios from '../api/axios';
import type { Facture } from '../types';
import './Factures.css';

const Factures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BROUILLON' | 'VALIDEE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Facture>({
    // Aligné sur le backend: numeroFacture, dateFacture, montantHT/TVA/TTC, fournisseur, etat
    numeroFacture: '',
    dateFacture: new Date().toISOString().split('T')[0],
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
    fournisseur: '',
    etat: 'BROUILLON',
    compteComptable: '',
    numeroBonCommande: '',
  } as unknown as Facture);

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const response = await axios.get('/factures');
      setFactures(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMontantChange = (montant: number) => {
    const montantHT = montant || 0;
    const montantTVA = montantHT * 0.2;
    const montantTTC = montantHT + montantTVA;
    setFormData({
      ...formData,
      montantHT,
      montantTVA: parseFloat(montantTVA.toFixed(2)),
      montantTTC: parseFloat(montantTTC.toFixed(2)),
    } as unknown as Facture);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/factures', formData);
      setShowForm(false);
      setFormData({
        numeroFacture: '',
        dateFacture: new Date().toISOString().split('T')[0],
        montantHT: 0,
        montantTVA: 0,
        montantTTC: 0,
        fournisseur: '',
        etat: 'BROUILLON',
        compteComptable: '',
        numeroBonCommande: '',
      } as unknown as Facture);
      fetchFactures();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
    }
  };

  const handleValiderFacture = async (id: number | undefined) => {
    if (!id) return;
    try {
      await axios.put(`/factures/${id}/valider`);
      fetchFactures();
    } catch (error) {
      console.error('Erreur lors de la validation de la facture:', error);
      alert('Erreur lors de la validation');
    }
  };

  type Totaux = {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    countTotal: number;
    countBrouillon: number;
    countValidee: number;
  };

  const computed = useMemo<Totaux>(() => {
    return factures.reduce<Totaux>(
      (acc, facture) => {
        const statut = (facture as any).etat || facture.status || 'BROUILLON';
        const montantHT = (facture as any).montantHT ?? facture.montant ?? 0;
        const montantTVA = (facture as any).montantTVA ?? facture.tva ?? montantHT * 0.2;
        const montantTTC = (facture as any).montantTTC ?? facture.totalTTC ?? montantHT + montantTVA;

        acc.totalHT += montantHT;
        acc.totalTVA += montantTVA;
        acc.totalTTC += montantTTC;
        acc.countTotal += 1;
        acc.countBrouillon += statut === 'BROUILLON' ? 1 : 0;
        acc.countValidee += statut !== 'BROUILLON' ? 1 : 0;
        return acc;
      },
      { totalHT: 0, totalTVA: 0, totalTTC: 0, countTotal: 0, countBrouillon: 0, countValidee: 0 }
    );
  }, [factures]);

  const filteredFactures = useMemo(() => {
    return factures.filter((facture) => {
      const statut = (facture as any).etat || facture.status || 'BROUILLON';
      const matchStatus = statusFilter === 'ALL' || statut === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchText =
        !term ||
        ((facture as any).numeroFacture || facture.numero || '').toString().toLowerCase().includes(term) ||
        ((facture as any).fournisseur || facture.clientNom || '').toLowerCase().includes(term);
      return matchStatus && matchText;
    });
  }, [factures, statusFilter, searchTerm]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="factures-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Pilotage comptable</p>
          <h1>Factures</h1>
          <p className="subtitle">Suivez vos pièces clients/fournisseurs et leurs impacts HT/TVA/TTC.</p>
        </div>
        <div className="header-actions">
          <div className="legend">
            <span className="status-pill brouillon">Brouillon</span>
            <span className="status-pill validee">Validée</span>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : 'Nouvelle facture'}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <p className="label">Total HT</p>
          <h3>{computed.totalHT.toFixed(2)} DT</h3>
          <p className="hint">Base taxable</p>
        </div>
        <div className="metric-card">
          <p className="label">TVA collectée</p>
          <h3>{computed.totalTVA.toFixed(2)} DT</h3>
          <p className="hint">Calculée à 20%</p>
        </div>
        <div className="metric-card">
          <p className="label">Total TTC</p>
          <h3>{computed.totalTTC.toFixed(2)} DT</h3>
          <p className="hint">Encaissements attendus</p>
        </div>
        <div className="metric-card">
          <p className="label">Workflow</p>
          <h3>{computed.countValidee}/{computed.countTotal}</h3>
          <p className="hint">Validées / totales</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="pills">
          <button
            className={`pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Toutes
          </button>
          <button
            className={`pill ${statusFilter === 'BROUILLON' ? 'active' : ''}`}
            onClick={() => setStatusFilter('BROUILLON')}
          >
            Brouillon ({computed.countBrouillon})
          </button>
          <button
            className={`pill ${statusFilter === 'VALIDEE' ? 'active' : ''}`}
            onClick={() => setStatusFilter('VALIDEE')}
          >
            Validée ({computed.countValidee})
          </button>
        </div>
        <input
          className="search"
          placeholder="Rechercher par numéro ou client/fournisseur"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="facture-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Numéro</label>
              <input
                type="text"
                value={(formData as any).numeroFacture || ''}
                onChange={(e) => setFormData({ ...formData, numeroFacture: e.target.value } as unknown as Facture)}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={(formData as any).dateFacture || ''}
                onChange={(e) => setFormData({ ...formData, dateFacture: e.target.value } as unknown as Facture)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Client</label>
              <input
                type="text"
                value={(formData as any).fournisseur || ''}
                onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value } as unknown as Facture)}
                required
              />
            </div>
            <div className="form-group">
              <label>Compte comptable (optionnel)</label>
              <input
                type="text"
                value={(formData as any).compteComptable || ''}
                onChange={(e) => setFormData({ ...formData, compteComptable: e.target.value } as unknown as Facture)}
                placeholder="Ex: 411 Clients"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Montant HT</label>
              <input
                type="number"
                step="0.01"
                value={(formData as any).montantHT || 0}
                onChange={(e) => handleMontantChange(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label>TVA (20%)</label>
              <input type="number" step="0.01" value={(formData as any).montantTVA || 0} disabled />
            </div>
            <div className="form-group">
              <label>Total TTC</label>
              <input type="number" step="0.01" value={(formData as any).montantTTC || 0} disabled />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-submit">Créer la facture</button>
        </form>
      )}

      <div className="factures-table">
        <table>
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Date</th>
              <th>Client</th>
              <th>Montant HT</th>
              <th>TVA</th>
              <th>Total TTC</th>
              <th>Compte</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map((facture) => {
              const statut = (facture as any).etat || facture.status || 'BROUILLON';
              const montantHT = (facture as any).montantHT ?? facture.montant ?? 0;
              const montantTVA = (facture as any).montantTVA ?? facture.tva ?? 0;
              const montantTTC = (facture as any).montantTTC ?? facture.totalTTC ?? 0;

              return (
                <tr key={facture.id}>
                  <td>{(facture as any).numeroFacture || facture.numero}</td>
                  <td>{(facture as any).dateFacture || facture.date}</td>
                  <td>{(facture as any).fournisseur || facture.clientNom}</td>
                  <td>{montantHT.toFixed(2)} DT</td>
                  <td>{montantTVA.toFixed(2)} DT</td>
                  <td>{montantTTC.toFixed(2)} DT</td>
                  <td>{(facture as any).compteComptable || '—'}</td>
                  <td>
                    <span className={`status ${statut.toLowerCase()}`}>
                      {statut}
                    </span>
                  </td>
                  <td>
                    {statut === 'BROUILLON' && (
                      <button
                        className="btn-valider"
                        onClick={() => handleValiderFacture(facture.id)}
                      >
                        Valider
                      </button>
                    )}
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

export default Factures;
