const fs = require('fs');
const path = require('path');

const comptesContent = `import { useEffect, useState } from 'react';
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
    status: 'ACTIF',
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
        status: 'ACTIF',
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
                  <span className={\`status \${compte.status.toLowerCase()}\`}>
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
`;

const navbarContent = `import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Compta Flow</h1>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Tableau de bord</Link></li>
        <li><Link to="/comptes">Plan Comptable</Link></li>
        <li><Link to="/journal">Écritures Comptables</Link></li>
        <li><Link to="/factures">Factures</Link></li>
        <li><Link to="/periods">Périodes Comptables</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
`;

const journalContent = `import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { JournalEntry, CompteComptable } from '../types';
import './JournalEntries.css';

const JournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [comptes, setComptes] = useState<CompteComptable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    lines: [
      { compte: comptes[0], libelle: '', debit: 0, credit: 0 },
      { compte: comptes[0], libelle: '', debit: 0, credit: 0 },
    ],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [entriesRes, comptesRes] = await Promise.all([
        axios.get('/journal-entries'),
        axios.get('/comptes'),
      ]);
      setEntries(entriesRes.data);
      setComptes(comptesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que débit = crédit
    const totalDebit = formData.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + line.credit, 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Erreur : Le total des débits doit égaler le total des crédits');
      return;
    }

    try {
      await axios.post('/journal-entries', formData);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la création de l\\'écriture:', error);
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
                    onChange={(e) => {
                      const compte = comptes.find((c) => c.id === parseInt(e.target.value));
                      const newLines = [...(formData.lines || [])];
                      newLines[idx] = { ...line, compte: compte || line.compte };
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
                <td>{entry.date}</td>
                <td>{entry.reference}</td>
                <td>{entry.description}</td>
                <td>
                  {entry.lines?.reduce((sum, line) => sum + line.debit, 0).toFixed(2)} €
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
`;

const facturesContent = `import { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { Facture } from '../types';
import './Factures.css';

const Factures = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Facture>({
    numero: '',
    date: new Date().toISOString().split('T')[0],
    montant: 0,
    tva: 0,
    totalTTC: 0,
    clientNom: '',
    description: '',
    type: 'VENTE',
    status: 'BROUILLON',
  });

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
    const tva = montant * 0.2;
    const totalTTC = montant + tva;
    setFormData({
      ...formData,
      montant,
      tva: parseFloat(tva.toFixed(2)),
      totalTTC: parseFloat(totalTTC.toFixed(2)),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/factures', formData);
      setShowForm(false);
      setFormData({
        numero: '',
        date: new Date().toISOString().split('T')[0],
        montant: 0,
        tva: 0,
        totalTTC: 0,
        clientNom: '',
        description: '',
        type: 'VENTE',
        status: 'BROUILLON',
      });
      fetchFactures();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="factures-page">
      <div className="page-header">
        <h1>Factures</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Nouvelle Facture'}
        </button>
      </div>

      {showForm && (
        <form className="facture-form" onSubmit={handleSubmit}>
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
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Client</label>
              <input
                type="text"
                value={formData.clientNom}
                onChange={(e) => setFormData({ ...formData, clientNom: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="VENTE">Facture de vente</option>
                <option value="ACHAT">Facture d'achat</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Montant HT</label>
              <input
                type="number"
                step="0.01"
                value={formData.montant}
                onChange={(e) => handleMontantChange(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label>TVA (20%)</label>
              <input type="number" step="0.01" value={formData.tva} disabled />
            </div>
            <div className="form-group">
              <label>Total TTC</label>
              <input type="number" step="0.01" value={formData.totalTTC} disabled />
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
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {factures.map((facture) => (
              <tr key={facture.id}>
                <td>{facture.numero}</td>
                <td>{facture.date}</td>
                <td>{facture.clientNom}</td>
                <td>{facture.montant.toFixed(2)} €</td>
                <td>{facture.tva.toFixed(2)} €</td>
                <td>{facture.totalTTC.toFixed(2)} €</td>
                <td>{facture.type}</td>
                <td>
                  <span className={\`status \${facture.status.toLowerCase()}\`}>
                    {facture.status}
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

export default Factures;
`;

const periodsContent = `import { useEffect, useState } from 'react';
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
      await axios.post(\`/periods/\${id}/close\`);
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
                <td>{period.month}</td>
                <td>
                  <span className={\`status \${period.status.toLowerCase()}\`}>
                    {period.status}
                  </span>
                </td>
                <td>{period.closedDate || '-'}</td>
                <td>
                  {period.status === 'OUVERT' && (
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
`;

// Écrire les fichiers
fs.writeFileSync('src/pages/Comptes.tsx', comptesContent, 'utf8');
fs.writeFileSync('src/components/Navbar.tsx', navbarContent, 'utf8');
fs.writeFileSync('src/pages/JournalEntries.tsx', journalContent, 'utf8');
fs.writeFileSync('src/pages/Factures.tsx', facturesContent, 'utf8');
fs.writeFileSync('src/pages/Periods.tsx', periodsContent, 'utf8');

console.log('✓ Tous les fichiers ont été recréés avec l encodage UTF-8 correct');
