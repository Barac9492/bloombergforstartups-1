import axios from 'axios';
import { logger } from '../../utils/logger';

export class GitHubService {
  private apiUrl = 'https://api.github.com';
  private token = process.env.GITHUB_TOKEN;

  async fetchActivity(companyOrUser: string): Promise<any[]> {
    if (!this.token) {
      logger.warn('GitHub token not configured');
      return [];
    }

    try {
      // Extract GitHub username from website URL if provided
      const username = this.extractUsername(companyOrUser);
      if (!username) return [];

      // Fetch recent activity
      const [commits, issues, prs] = await Promise.all([
        this.fetchCommits(username),
        this.fetchIssues(username),
        this.fetchPullRequests(username),
      ]);

      return [...commits, ...issues, ...prs];
    } catch (error) {
      logger.error('Error fetching GitHub activity', error);
      return [];
    }
  }

  private extractUsername(input: string): string | null {
    // Handle GitHub URLs
    const githubUrlPattern = /github\.com\/([^\/]+)/;
    const match = input.match(githubUrlPattern);
    if (match) return match[1];
    
    // Assume it's already a username if no URL
    return input.includes('.') ? null : input;
  }

  private async fetchCommits(username: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/users/${username}/events`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            per_page: 30,
          },
        }
      );

      return response.data
        .filter((event: any) => event.type === 'PushEvent')
        .map((event: any) => ({
          type: 'commit',
          message: event.payload.commits?.[0]?.message || 'Commit',
          url: `https://github.com/${event.repo.name}`,
          createdAt: event.created_at,
        }));
    } catch (error) {
      logger.error(`Error fetching commits for ${username}`, error);
      return [];
    }
  }

  private async fetchIssues(username: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/search/issues`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            q: `author:${username} is:issue`,
            sort: 'created',
            order: 'desc',
            per_page: 10,
          },
        }
      );

      return response.data.items.map((issue: any) => ({
        type: 'issue',
        message: issue.title,
        description: issue.body,
        url: issue.html_url,
        createdAt: issue.created_at,
      }));
    } catch (error) {
      logger.error(`Error fetching issues for ${username}`, error);
      return [];
    }
  }

  private async fetchPullRequests(username: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/search/issues`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            q: `author:${username} is:pr`,
            sort: 'created',
            order: 'desc',
            per_page: 10,
          },
        }
      );

      return response.data.items.map((pr: any) => ({
        type: 'pull_request',
        message: pr.title,
        description: pr.body,
        url: pr.html_url,
        createdAt: pr.created_at,
      }));
    } catch (error) {
      logger.error(`Error fetching PRs for ${username}`, error);
      return [];
    }
  }
}