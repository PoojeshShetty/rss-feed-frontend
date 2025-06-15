import { RSSFeed, BlogPost } from '../types';

export const mockFeeds: RSSFeed[] = [
  {
    id: '1',
    title: 'TechCrunch',
    description: 'The latest technology news and information on startups',
    feedUrl: 'https://techcrunch.com/feed/',
    siteUrl: 'https://techcrunch.com',
    category: 'Technology',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Hacker News',
    description: 'Social news website focusing on computer science and entrepreneurship',
    feedUrl: 'https://hnrss.org/frontpage',
    siteUrl: 'https://news.ycombinator.com',
    category: 'Technology',
    lastUpdated: '2024-01-15T09:45:00Z'
  },
  {
    id: '3',
    title: 'The Verge',
    description: 'Technology, science, art, and culture',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    siteUrl: 'https://www.theverge.com',
    category: 'Technology',
    lastUpdated: '2024-01-15T11:15:00Z'
  },
  {
    id: '4',
    title: 'Financial Times',
    description: 'Global financial news and analysis',
    feedUrl: 'https://www.ft.com/rss',
    siteUrl: 'https://www.ft.com',
    category: 'Finance',
    lastUpdated: '2024-01-15T08:30:00Z'
  },
  {
    id: '5',
    title: 'Wall Street Journal',
    description: 'Business and financial news',
    feedUrl: 'https://feeds.wsj.com/wsj/xml/rss/3_7085.xml',
    siteUrl: 'https://wsj.com',
    category: 'Finance',
    lastUpdated: '2024-01-15T07:20:00Z'
  },
  {
    id: '6',
    title: 'Marginal Revolution',
    description: 'Small steps toward a much better world',
    feedUrl: 'https://marginalrevolution.com/feed',
    siteUrl: 'https://marginalrevolution.com',
    category: 'Economics',
    lastUpdated: '2024-01-15T06:45:00Z'
  },
  {
    id: '7',
    title: 'History Today',
    description: 'The world\'s leading history magazine',
    feedUrl: 'https://www.historytoday.com/rss.xml',
    siteUrl: 'https://www.historytoday.com',
    category: 'History',
    lastUpdated: '2024-01-15T05:30:00Z'
  },
  {
    id: '8',
    title: 'Smithsonian Magazine',
    description: 'History, science, arts, and culture',
    feedUrl: 'https://www.smithsonianmag.com/rss/',
    siteUrl: 'https://www.smithsonianmag.com',
    category: 'History',
    lastUpdated: '2024-01-15T04:15:00Z'
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in 2024',
    summary: 'Exploring the latest trends and developments in AI technology that will shape the coming year.',
    contentHtml: '<p>Artificial Intelligence continues to evolve at an unprecedented pace. In 2024, we\'re seeing remarkable advances in generative AI, machine learning models, and practical applications across industries.</p><p>The integration of AI into everyday tools has transformed how we work, create, and communicate. From writing assistants to image generation, these technologies are becoming increasingly sophisticated and accessible.</p><p>Key developments include improved natural language processing, more efficient training methods, and better alignment with human values and intentions.</p>',
    author: 'Sarah Johnson',
    publishedAt: '2024-01-15T10:30:00Z',
    sourceFeedId: '1',
    sourceFeedName: 'TechCrunch',
    originalUrl: 'https://techcrunch.com/future-ai-2024',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Understanding Modern Web Development Frameworks',
    summary: 'A comprehensive guide to choosing the right framework for your next project.',
    contentHtml: '<p>The landscape of web development frameworks continues to evolve rapidly. React, Vue, Angular, and newer frameworks like Svelte each offer unique advantages for different types of projects.</p><p>When choosing a framework, consider factors such as project requirements, team expertise, performance needs, and long-term maintenance.</p><p>React remains popular for its flexibility and ecosystem, while Vue offers an approachable learning curve. Angular provides a complete solution for enterprise applications.</p>',
    author: 'Michael Chen',
    publishedAt: '2024-01-15T09:45:00Z',
    sourceFeedId: '2',
    sourceFeedName: 'Hacker News',
    originalUrl: 'https://news.ycombinator.com/web-frameworks-guide',
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'The Rise of Sustainable Technology',
    summary: 'How green tech innovations are reshaping industries and fighting climate change.',
    contentHtml: '<p>Sustainable technology is no longer just a buzzword—it\'s becoming a critical component of business strategy across all industries.</p><p>From renewable energy solutions to carbon capture technologies, innovations in green tech are providing viable alternatives to traditional methods.</p><p>Companies are investing heavily in sustainable practices, driven by both environmental concerns and economic incentives.</p>',
    author: 'Emily Rodriguez',
    publishedAt: '2024-01-15T08:20:00Z',
    sourceFeedId: '3',
    sourceFeedName: 'The Verge',
    originalUrl: 'https://theverge.com/sustainable-tech-rise',
    imageUrl: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    title: 'Global Markets Navigate Economic Uncertainty',
    summary: 'Analysis of current market trends and their implications for investors.',
    contentHtml: '<p>Global financial markets continue to face headwinds from various economic factors including inflation concerns, geopolitical tensions, and supply chain disruptions.</p><p>Investors are seeking stability in uncertain times, with many turning to defensive strategies and diversified portfolios.</p><p>Central banks worldwide are carefully balancing monetary policy to address inflation while supporting economic growth.</p>',
    author: 'David Thompson',
    publishedAt: '2024-01-15T07:30:00Z',
    sourceFeedId: '4',
    sourceFeedName: 'Financial Times',
    originalUrl: 'https://ft.com/global-markets-uncertainty',
    imageUrl: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    title: 'The Economics of Remote Work',
    summary: 'How distributed teams are changing the economic landscape of employment.',
    contentHtml: '<p>Remote work has fundamentally altered the economics of employment, creating new opportunities and challenges for both employers and employees.</p><p>Geographic arbitrage allows companies to access global talent pools while employees gain location independence.</p><p>This shift is reshaping urban economies, real estate markets, and traditional business models across industries.</p>',
    author: 'Lisa Wang',
    publishedAt: '2024-01-15T06:45:00Z',
    sourceFeedId: '6',
    sourceFeedName: 'Marginal Revolution',
    originalUrl: 'https://marginalrevolution.com/remote-work-economics',
    imageUrl: 'https://images.pexels.com/photos/4031818/pexels-photo-4031818.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export const categories = [
  'All',
  'Technology', 
  'Finance',
  'Economics',
  'History',
  'Science',
  'Arts',
  'Politics',
  'Health'
];