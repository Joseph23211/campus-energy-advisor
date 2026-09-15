import React from 'react';
import { Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';
import RecommendationCard from './RecommendationCard';
import { mockRecommendations } from '../data/mockRecommendations';

export default function EnergyAdvisor({ limit = 3 }) {
  const items = mockRecommendations.filter((r) => r.status !== 'Completed').slice(0, limit);

  return (
    <div>
      <SectionHeader
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-current-teal" />
            Energy Advisor
          </span>
        }
        subtitle="Intelligent recommendations based on campus energy patterns."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((rec, i) => (
          <RecommendationCard key={rec.id} rec={rec} delay={i * 0.08} />
        ))}
      </div>
    </div>
  );
}
