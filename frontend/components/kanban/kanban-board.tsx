'use client';

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { DealCard } from './deal-card';
import { useDealsStore } from '@/lib/stores/deals';
import { useSocket } from '@/hooks/useSocket';
import { Deal, KanbanColumn as KanbanColumnType } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DEFAULT_STAGES = [
  'Lead',
  'Qualified',
  'Meeting Scheduled',
  'Proposal Sent',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

export function KanbanBoard() {
  const { deals, fetchDeals, moveDeal } = useDealsStore();
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useSocket(); // Enable real-time updates

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    // Group deals by stage
    const groupedDeals = DEFAULT_STAGES.map(stage => ({
      id: stage,
      title: stage,
      deals: deals.filter(deal => deal.stage === stage),
    }));

    setColumns(groupedDeals);
  }, [deals]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    
    const deal = deals.find(d => d.id === active.id);
    setActiveDeal(deal || null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      setActiveDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStage = over.id as string;

    // Optimistically update UI
    setColumns(prev => {
      const newColumns = [...prev];
      
      // Find and remove deal from current column
      const currentColumn = newColumns.find(col => 
        col.deals.some(deal => deal.id === dealId)
      );
      if (currentColumn) {
        currentColumn.deals = currentColumn.deals.filter(deal => deal.id !== dealId);
      }
      
      // Add deal to new column
      const targetColumn = newColumns.find(col => col.id === newStage);
      const deal = deals.find(d => d.id === dealId);
      if (targetColumn && deal) {
        targetColumn.deals.push({ ...deal, stage: newStage });
      }
      
      return newColumns;
    });

    try {
      await moveDeal(dealId, newStage);
    } catch (error) {
      console.error('Error moving deal:', error);
      // Revert on error
      fetchDeals();
    }

    setActiveId(null);
    setActiveDeal(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Deal Pipeline</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          <SortableContext items={columns.map(col => col.id)}>
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                deals={column.deals}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}