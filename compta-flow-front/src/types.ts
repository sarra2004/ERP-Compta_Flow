export interface CompteComptable { id?: number; numero: string; intitule: string; classe: string; type: string; status: string; }


export interface JournalEntryLine { id?: number; compte: CompteComptable; libelle: string; debit: number; credit: number; }


export interface JournalEntry { id?: number; date: string; reference: string; description: string; lines: JournalEntryLine[]; }


export interface Facture { id?: number; numero: string; date: string; montant: number; tva: number; totalTTC: number; clientNom: string; description: string; type: string; status: string; }


export interface AccountingPeriod { id?: number; year: number; month: number; status: string; closedDate?: string; }
