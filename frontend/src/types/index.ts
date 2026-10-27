export type ProjectStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';

export interface Project {
  id: string;
  developerId: string;
  name: string;
  location: string;
  description: string;
  fundingGoal: number; // in minor units / cents or USD
  fundsRaised: number;
  fundedPercent: number;
  progress: number; // construction progress 0-100
  status: ProjectStatus;
  createdAt: string;
  expectedApy?: number;
  minInvestment?: number;
  durationMonths?: number;
  tokenSymbol?: string;
  imageUrl?: string;
  category?: string;
}

export interface Investment {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  tokens: number;
  date: string;
  status: 'active' | 'completed' | 'processing';
  simulatedTxHash: string;
}

export interface SecondaryMarketOrder {
  id: string;
  projectId: string;
  projectName: string;
  tokenSymbol: string;
  type: 'buy' | 'sell';
  amountTokens: number;
  pricePerToken: number;
  totalValue: number;
  sellerOrBuyerId: string;
  status: 'open' | 'matched' | 'cancelled';
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: 'deposit' | 'investment' | 'yield' | 'trade';
  description: string;
  amount: number;
  balanceAfter: number;
  referenceId: string;
}
