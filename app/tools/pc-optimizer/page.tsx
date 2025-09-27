// app/tools/pc-optimizer/page.tsx

import { Metadata } from 'next';
import PCOptimizerClient from './components/PCOptimizerClient';

export const metadata: Metadata = {
  title: 'PC Optimizer Advisor - Free Storage Analysis | AI AutoSite',
  description: 'Analyze PC storage usage, find unused programs, and get optimization recommendations. 100% private browser-based processing.',
};

export default function PCOptimizerPage() {
  return <PCOptimizerClient />;
}