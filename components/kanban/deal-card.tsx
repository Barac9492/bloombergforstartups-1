'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Building2, Calendar, DollarSign, Mail, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export function DealCard({ deal, isDragging = false }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get latest sentiment
  const latestSentiment = deal.sentiments?.[0];
  const sentimentIcon = latestSentiment ? (
    latestSentiment.score > 0.1 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : latestSentiment.score < -0.1 ? (
      <TrendingDown className="w-4 h-4 text-red-500" />
    ) : (
      <Minus className="w-4 h-4 text-gray-400" />
    )
  ) : null;

  const probabilityColor = 
    deal.probability > 0.7 ? 'text-green-600' :
    deal.probability > 0.4 ? 'text-yellow-600' :
    'text-red-600';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging || isSortableDragging ? 'opacity-50' : ''
      }`}
    >
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{deal.name}</h4>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Building2 className="w-3 h-3 mr-1" />
                {deal.company}
              </div>
            </div>
            {sentimentIcon && (
              <div className="ml-2">{sentimentIcon}</div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            {deal.value && (
              <div className="flex items-center text-sm">
                <DollarSign className="w-3 h-3 mr-1 text-green-600" />
                <span className="font-medium">{formatCurrency(deal.value)}</span>
                <span className={`ml-2 text-xs ${probabilityColor}`}>
                  {Math.round(deal.probability * 100)}%
                </span>
              </div>
            )}

            {deal.contact && (
              <div className="flex items-center text-xs text-gray-600">
                <Mail className="w-3 h-3 mr-1" />
                {deal.contact}
              </div>
            )}

            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatRelativeTime(deal.updatedAt)}
            </div>

            {deal.tags && deal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {deal.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {deal.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{deal.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {deal.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mt-2">
                {deal.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}