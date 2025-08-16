import axios from 'axios';
import { logger } from '../../utils/logger';

export class TwitterService {
  private apiUrl = 'https://api.twitter.com/2';
  private bearerToken = process.env.TWITTER_BEARER_TOKEN;

  async fetchTweets(username: string): Promise<any[]> {
    if (!this.bearerToken) {
      logger.warn('Twitter Bearer Token not configured');
      return [];
    }

    try {
      // Note: Twitter API v2 requires paid access for most endpoints
      // This is a placeholder implementation
      const userId = await this.getUserId(username);
      if (!userId) return [];

      const response = await axios.get(
        `${this.apiUrl}/users/${userId}/tweets`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
          params: {
            max_results: 20,
            'tweet.fields': 'created_at,text',
          },
        }
      );

      return response.data.data?.map((tweet: any) => ({
        text: tweet.text,
        url: `https://twitter.com/${username}/status/${tweet.id}`,
        createdAt: tweet.created_at,
      })) || [];
    } catch (error) {
      logger.error('Error fetching tweets', error);
      return [];
    }
  }

  private async getUserId(username: string): Promise<string | null> {
    try {
      const cleanUsername = username.replace('@', '');
      const response = await axios.get(
        `${this.apiUrl}/users/by/username/${cleanUsername}`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
        }
      );
      return response.data.data?.id || null;
    } catch (error) {
      logger.error(`Error fetching Twitter user ID for ${username}`, error);
      return null;
    }
  }
}