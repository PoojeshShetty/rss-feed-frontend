export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface RSSFeed {
  id: string;
  title: string;
  description: string;
  feedUrl: string;
  siteUrl: string;
  category: string;
  isSubscribed?: boolean;
  isBookmarked?: boolean;
  lastUpdated?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  contentHtml: string;
  author?: string;
  publishedAt: string;
  sourceFeedId: string;
  sourceFeedName: string;
  originalUrl: string;
  imageUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface AppContextType {
  feeds: RSSFeed[];
  blogPosts: BlogPost[];
  subscribedFeeds: string[];
  bookmarkedPosts: string[];
  subscribe: (feedId: string) => void;
  unsubscribe: (feedId: string) => void;
  bookmarkPost: (postId: string) => void;
  unbookmarkPost: (postId: string) => void;
  addCustomFeed: (feedUrl: string) => Promise<boolean>;
  refreshFeeds: () => Promise<void>;
  isLoading: boolean;
}