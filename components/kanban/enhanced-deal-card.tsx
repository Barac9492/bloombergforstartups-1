'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { 
  Building2, Calendar, DollarSign, Mail, TrendingUp, TrendingDown, 
  Minus, Star, AlertCircle, Clock, Users, Globe, GitBranch
} from 'lucide-react';

interface EnhancedDealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export function EnhancedDealCard({ deal, isDragging = false }: EnhancedDealCardProps) {
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

  // Enhanced sentiment with confidence indicators
  const latestSentiment = deal.sentiments?.[0];
  const sentimentIcon = latestSentiment ? (
    latestSentiment.score > 0.1 ? (
      <div className="flex items-center space-x-1">
        <TrendingUp className="w-4 h-4 text-emerald-500" />
        <div className="status-dot status-success"></div>
      </div>
    ) : latestSentiment.score < -0.1 ? (
      <div className="flex items-center space-x-1">
        <TrendingDown className="w-4 h-4 text-red-500" />
        <div className="status-dot status-error"></div>
      </div>
    ) : (
      <div className="flex items-center space-x-1">
        <Minus className="w-4 h-4 text-slate-400" />
        <div className="status-dot bg-slate-300"></div>
      </div>
    )
  ) : null;

  // Enhanced probability visualization
  const probabilityColor = 
    deal.probability > 0.7 ? 'text-emerald-600 bg-emerald-50' :
    deal.probability > 0.4 ? 'text-amber-600 bg-amber-50' :
    'text-red-600 bg-red-50';

  // Triangulated confidence score based on multiple data points
  const getConfidenceScore = () => {
    let score = 0;
    if (deal.sentiments && deal.sentiments.length > 0) score += 25;
    if (deal.website) score += 25;
    if (deal.activities && deal.activities.length > 5) score += 25;
    if (deal.value && deal.value > 0) score += 25;
    return score;
  };

  const confidenceScore = getConfidenceScore();
  const confidenceColor = 
    confidenceScore >= 75 ? 'text-emerald-600' :
    confidenceScore >= 50 ? 'text-amber-600' :
    'text-red-600';

  // Priority indicator based on value and recency
  const isPriority = deal.value && deal.value > 100000 && deal.probability > 0.6;
  const isUrgent = new Date(deal.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging || isSortableDragging ? 'opacity-50 scale-105' : ''
      }`}
    >
      <Card className={`
        card-hover relative overflow-hidden
        ${isPriority ? 'ring-2 ring-amber-200 border-amber-300' : ''}
        ${isUrgent ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-blue-400'}
        bg-gradient-to-br from-white to-slate-50/50
        hover:shadow-lg hover:shadow-blue-100/50
      `}>
        {/* Priority badge */}
        {isPriority && (
          <div className="absolute top-2 right-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-200" />
          </div>
        )}

        {/* Urgent indicator */}
        {isUrgent && (
          <div className="absolute top-2 left-2">
            <div className="pulse-glow">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          </div>
        )}

        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                {deal.name}
              </h4>
              <div className="flex items-center text-xs text-slate-500">
                <Building2 className="w-3 h-3 mr-1" />
                <span className="truncate">{deal.company}</span>
              </div>
              
              {/* Confidence indicator */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-200">
                    <div 
                      className={`w-full h-full rounded-full transition-all ${
                        confidenceScore >= 75 ? 'bg-emerald-400' :
                        confidenceScore >= 50 ? 'bg-amber-400' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${confidenceScore}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${confidenceColor}`}>
                    {confidenceScore}% data
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {sentimentIcon}
              {deal.website && (
                <Globe className="w-3 h-3 text-slate-400" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Value and probability */}
          {deal.value && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span className="font-semibold text-sm text-slate-900">
                  {formatCurrency(deal.value)}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${probabilityColor}`}>
                {Math.round(deal.probability * 100)}%
              </div>
            </div>
          )}

          {/* Contact info */}
          {deal.contact && (
            <div className="flex items-center space-x-1 text-xs text-slate-600">
              <Mail className="w-3 h-3" />
              <span className="truncate">{deal.contact}</span>
            </div>
          )}

          {/* Activity indicators */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(deal.updatedAt)}</span>
            </div>
            
            {deal.activities && deal.activities.length > 0 && (
              <div className="flex items-center space-x-1 text-slate-500">
                <Users className="w-3 h-3" />
                <span>{deal.activities.length}</span>
              </div>
            )}
          </div>

          {/* Tags with enhanced styling */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {deal.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-100"
                >
                  {tag}
                </span>
              ))}
              {deal.tags.length > 2 && (
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  +{deal.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Description with fade effect */}
          {deal.description && (
            <div className="relative">
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {deal.description}
              </p>
              <div className="absolute bottom-0 right-0 w-8 h-4 bg-gradient-to-l from-white to-transparent"></div>
            </div>
          )}

          {/* Data source indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              {deal.sentiments && deal.sentiments.length > 0 && (
                <div className="flex items-center space-x-1">
                  <GitBranch className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {deal.sentiments.length} signals
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-slate-400">
              ID: {deal.id.slice(-6)}
            </div>
          </div>
        </CardContent>

        {/* Shimmer effect for loading state */}
        {isDragging && (
          <div className="absolute inset-0 shimmer opacity-20"></div>
        )}
      </Card>
    </div>
  );
}