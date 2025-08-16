import axios from 'axios';
import { logger } from '../../utils/logger';

export class HubSpotService {
  private apiUrl = 'https://api.hubapi.com';

  async importDeals(config: any): Promise<any[]> {
    const { apiKey } = config;

    if (!apiKey) {
      logger.error('HubSpot API key not configured');
      return [];
    }

    try {
      const response = await axios.get(
        `${this.apiUrl}/crm/v3/objects/deals`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          params: {
            limit: 100,
            properties: 'dealname,amount,dealstage,closedate,description',
          },
        }
      );

      return response.data.results.map((deal: any) => ({
        name: deal.properties.dealname,
        company: deal.properties.associatedcompanyid || '',
        description: deal.properties.description,
        stage: this.mapHubSpotStage(deal.properties.dealstage),
        value: parseFloat(deal.properties.amount) || 0,
        closedAt: deal.properties.closedate ? new Date(deal.properties.closedate) : null,
      }));
    } catch (error) {
      logger.error('Error importing from HubSpot', error);
      throw error;
    }
  }

  async exportDeals(deals: any[], config: any): Promise<any[]> {
    const { apiKey } = config;

    if (!apiKey) {
      logger.error('HubSpot API key not configured');
      return [];
    }

    try {
      const createdDeals = await Promise.all(
        deals.map(deal =>
          axios.post(
            `${this.apiUrl}/crm/v3/objects/deals`,
            {
              properties: {
                dealname: deal.name,
                amount: deal.value?.toString() || '0',
                dealstage: this.mapToHubSpotStage(deal.stage),
                description: deal.description || '',
              },
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }
          )
        )
      );

      return createdDeals.map(r => r.data);
    } catch (error) {
      logger.error('Error exporting to HubSpot', error);
      throw error;
    }
  }

  private mapHubSpotStage(hubspotStage: string): string {
    const stageMap: Record<string, string> = {
      appointmentscheduled: 'Meeting Scheduled',
      qualifiedtobuy: 'Qualified',
      presentationscheduled: 'Presentation',
      decisionmakerboughtin: 'Decision Maker',
      contractsent: 'Contract Sent',
      closedwon: 'Closed Won',
      closedlost: 'Closed Lost',
    };
    return stageMap[hubspotStage] || 'Lead';
  }

  private mapToHubSpotStage(stage: string): string {
    const stageMap: Record<string, string> = {
      'Lead': 'appointmentscheduled',
      'Meeting Scheduled': 'appointmentscheduled',
      'Qualified': 'qualifiedtobuy',
      'Presentation': 'presentationscheduled',
      'Decision Maker': 'decisionmakerboughtin',
      'Contract Sent': 'contractsent',
      'Closed Won': 'closedwon',
      'Closed Lost': 'closedlost',
    };
    return stageMap[stage] || 'appointmentscheduled';
  }
}