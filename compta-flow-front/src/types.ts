export interface CompteComptable {
  id?: number;
  numero: string;
  intitule: string;
  classe: string;
  type: string;
  status: string;
}

export interface JournalEntryLine {
  id?: number;
  compte: CompteComptable | null;
  libelle: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id?: number;
  date: string;
  reference: string;
  description: string;
  lines: JournalEntryLine[];
  period?: AccountingPeriod;
  periodId?: number;
  status?: 'DRAFT' | 'POSTED';
}

// Interface étendue pour couvrir les champs utilisés par le backend et le frontend
export interface Facture {
  id?: number;
  // Nommage côté frontend (Factures.tsx)
  numeroFacture?: string;
  dateFacture?: string;
  fournisseur?: string;
  etat?: 'BROUILLON' | 'VALIDEE' | string;
  compteComptable?: string;
  numeroBonCommande?: string;
  montantHT?: number;
  montantTVA?: number;
  montantTTC?: number;
  // Nommage alternatif (compat backend générique)
  numero?: string;
  date?: string;
  clientNom?: string;
  montant?: number;
  tva?: number;
  totalTTC?: number;
  description?: string;
  type?: string;
  status?: string;
}

export interface AccountingPeriod {
  id?: number;
  year: number;
  month: number;
  status: string;
  closedDate?: string;
}

export interface MouvementTresorerie {
  id?: number;
  date: string;
  libelle: string;
  type: 'ENTREE' | 'SORTIE';
  montant?: number;
  moyenPaiement: string;
  reference?: string;
}

