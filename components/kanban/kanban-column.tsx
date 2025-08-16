'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DealCard } from './deal-card';
import { Deal, KanbanColumn as KanbanColumnType } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface KanbanColumnProps {
  column: KanbanColumnType;
  deals: Deal[];
}

export function KanbanColumn({ column, deals }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {deals.length}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[500px] p-2 rounded-lg transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-gray-25'
        }`}
      >
        <SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </SortableContext>
        
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}