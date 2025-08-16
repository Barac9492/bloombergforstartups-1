import axios from 'axios';
import { logger } from '../../utils/logger';

export class NotionService {
  private apiUrl = 'https://api.notion.com/v1';

  async importDeals(config: any): Promise<any[]> {
    const { apiKey, databaseId } = config;

    if (!apiKey || !databaseId) {
      logger.error('Notion configuration incomplete');
      return [];
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/databases/${databaseId}/query`,
        {},
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.results.map((page: any) => {
        const props = page.properties;
        return {
          name: this.getPropertyValue(props.Name || props.Title),
          company: this.getPropertyValue(props.Company),
          description: this.getPropertyValue(props.Description),
          stage: this.getPropertyValue(props.Stage) || 'Lead',
          value: this.getNumberValue(props.Value),
          contact: this.getPropertyValue(props.Contact),
          email: this.getPropertyValue(props.Email),
          website: this.getPropertyValue(props.Website),
          notes: this.getPropertyValue(props.Notes),
          tags: this.getMultiSelectValue(props.Tags),
        };
      });
    } catch (error) {
      logger.error('Error importing from Notion', error);
      throw error;
    }
  }

  async exportDeals(deals: any[], config: any): Promise<any[]> {
    const { apiKey, databaseId } = config;

    if (!apiKey || !databaseId) {
      logger.error('Notion configuration incomplete');
      return [];
    }

    try {
      const pages = await Promise.all(
        deals.map(deal =>
          axios.post(
            `${this.apiUrl}/pages`,
            {
              parent: { database_id: databaseId },
              properties: {
                Name: { title: [{ text: { content: deal.name } }] },
                Company: { rich_text: [{ text: { content: deal.company || '' } }] },
                Description: { rich_text: [{ text: { content: deal.description || '' } }] },
                Stage: { select: { name: deal.stage } },
                Value: { number: deal.value || 0 },
                Contact: { rich_text: [{ text: { content: deal.contact || '' } }] },
                Email: { email: deal.email || undefined },
                Website: { url: deal.website || undefined },
                Notes: { rich_text: [{ text: { content: deal.notes || '' } }] },
              },
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
              },
            }
          )
        )
      );

      return pages.map(p => p.data);
    } catch (error) {
      logger.error('Error exporting to Notion', error);
      throw error;
    }
  }

  private getPropertyValue(prop: any): string | null {
    if (!prop) return null;
    
    switch (prop.type) {
      case 'title':
        return prop.title[0]?.text?.content || null;
      case 'rich_text':
        return prop.rich_text[0]?.text?.content || null;
      case 'select':
        return prop.select?.name || null;
      case 'email':
        return prop.email || null;
      case 'url':
        return prop.url || null;
      default:
        return null;
    }
  }

  private getNumberValue(prop: any): number {
    return prop?.number || 0;
  }

  private getMultiSelectValue(prop: any): string[] {
    if (!prop || prop.type !== 'multi_select') return [];
    return prop.multi_select.map((item: any) => item.name);
  }
}