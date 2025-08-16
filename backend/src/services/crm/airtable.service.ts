import axios from 'axios';
import { logger } from '../../utils/logger';

export class AirtableService {
  private apiUrl = 'https://api.airtable.com/v0';

  async importDeals(config: any): Promise<any[]> {
    const { apiKey, baseId, tableName } = config;

    if (!apiKey || !baseId || !tableName) {
      logger.error('Airtable configuration incomplete');
      return [];
    }

    try {
      const response = await axios.get(
        `${this.apiUrl}/${baseId}/${tableName}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.records.map((record: any) => ({
        name: record.fields.Name || record.fields.Company,
        company: record.fields.Company || record.fields.Name,
        description: record.fields.Description || record.fields.Notes,
        stage: record.fields.Stage || 'Lead',
        value: parseFloat(record.fields.Value) || 0,
        contact: record.fields.Contact,
        email: record.fields.Email,
        website: record.fields.Website,
        notes: record.fields.Notes,
        tags: record.fields.Tags ? record.fields.Tags.split(',') : [],
      }));
    } catch (error) {
      logger.error('Error importing from Airtable', error);
      throw error;
    }
  }

  async exportDeals(deals: any[], config: any): Promise<any[]> {
    const { apiKey, baseId, tableName } = config;

    if (!apiKey || !baseId || !tableName) {
      logger.error('Airtable configuration incomplete');
      return [];
    }

    try {
      const records = deals.map(deal => ({
        fields: {
          Name: deal.name,
          Company: deal.company,
          Description: deal.description,
          Stage: deal.stage,
          Value: deal.value,
          Contact: deal.contact,
          Email: deal.email,
          Website: deal.website,
          Notes: deal.notes,
          Tags: deal.tags?.join(','),
        },
      }));

      const response = await axios.post(
        `${this.apiUrl}/${baseId}/${tableName}`,
        { records },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.records;
    } catch (error) {
      logger.error('Error exporting to Airtable', error);
      throw error;
    }
  }
}