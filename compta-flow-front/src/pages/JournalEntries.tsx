import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { JournalEntry, CompteComptable, AccountingPeriod } from '../types';
import './JournalEntries.css';

const JournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [comptes, setComptes] = useState<CompteComptable[]>([]);
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    lines: [],
    periodId: undefined,
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Dès que les comptes sont chargés, pré-remplir deux lignes avec le premier compte pour éviter les comptes null
  useEffect(() => {
    if (comptes.length > 0 && (formData.lines?.length ?? 0) === 0) {
      setFormData((prev) => ({
        ...prev,
        lines: [
          { compte: comptes[0], libelle: '', debit: 0, credit: 0 },
          { compte: comptes[0], libelle: '', debit: 0, credit: 0 },
        ],
      }));
    }
  }, [comptes]);

  const fetchData = async () => {
    try {
      const [entriesRes, comptesRes, periodsRes] = await Promise.all([
        axios.get('/journal-entries'),
        axios.get('/comptes'),
        axios.get('/periods'),
      ]);
      setEntries(entriesRes.data);
      setComptes(comptesRes.data);
      setPeriods(periodsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.periodId) {
      setError('Veuillez sélectionner une période comptable');
      return;
    }
    
    // Vérifier que débit = crédit
    const totalDebit = formData.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + line.credit, 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      setError('Le total des débits doit égaler le total des crédits');
      return;
    }

    try {
      // Adapter le payload au backend: entryDate/entryNumber + lines.account + period
      const payload = {
        entryDate: formData.date,
        entryNumber: formData.reference,
        description: formData.description,
        period: { id: formData.periodId },
        lines: formData.lines.map((line) => ({
          account: line.compte ? { id: line.compte.id } : null,
          description: line.libelle,
          debit: line.debit,
          credit: line.credit,
        })),
      };

      await axios.post('/journal-entries', payload);
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        reference: '',
        description: '',
        lines: [],
        periodId: undefined,
      });
      fetchData();
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'écriture:', error);
      console.error('Response data:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Impossible de créer l\'écriture';
      setError(errorMsg);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="journal-page">
      <div className="page-header">
        <h1>Écritures Comptables</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouvelle Écriture'}
        </button>
      </div>

      {showForm && (
        <form className="journal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label>Période comptable *</label>
              <select
                value={formData.periodId || ''}
                onChange={(e) => setFormData({ ...formData, periodId: parseInt(e.target.value) })}
                required
              >
                <option value="">-- Sélectionner une période --</option>
                {periods
                  .filter(p => (p as any).status === 'OPEN')
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.month ? `${p.month}/${p.year}` : `${p.year} (Annuelle)`}
                    </option>
                  ))}
              </select>
              {periods.filter(p => (p as any).status === 'OPEN').length === 0 && (
                <small style={{ color: '#dc3545' }}>Aucune période ouverte. Créez-en une d'abord.</small>
              )}
            </div>
          </div>

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
              <label>Référence</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="lines-section">
            <h3>Lignes d'écriture</h3>
            {formData.lines?.map((line, idx) => (
              <div key={idx} className="line-row">
                <div className="form-group">
                  <label>Compte</label>
                  <select
                    value={line.compte?.id || ''}
                    required
                    onChange={(e) => {
                      const compte = comptes.find((c) => c.id === parseInt(e.target.value));
                      const newLines = [...(formData.lines || [])];
                      newLines[idx] = { ...line, compte: compte || null };
                      setFormData({ ...formData, lines: newLines });
                    }}
                  >
                    <option value="">Sélectionner</option>
                    {comptes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.numero} - {c.intitule}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Libellé</label>
                  <input
                    type="text"
                    value={line.libelle}
                    onChange={(e) => {
                      const newLines = [...(formData.lines || [])];
                      newLines[idx] = { ...line, libelle: e.target.value };
                      setFormData({ ...formData, lines: newLines });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Débit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={line.debit}
                    onChange={(e) => {
                      const newLines = [...(formData.lines || [])];
                      newLines[idx] = { ...line, debit: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, lines: newLines });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Crédit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={line.credit}
                    onChange={(e) => {
                      const newLines = [...(formData.lines || [])];
                      newLines[idx] = { ...line, credit: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, lines: newLines });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-submit">Enregistrer l'écriture</button>
        </form>
      )}

      <div className="entries-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Référence</th>
              <th>Description</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{(entry as any).entryDate || entry.date}</td>
                <td>{(entry as any).entryNumber || entry.reference}</td>
                <td>{entry.description}</td>
                <td>
                  {(entry.lines?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0).toFixed(2)} DT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalEntries;
