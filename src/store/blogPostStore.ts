import { create } from "zustand";

interface BlogPost {
  feed_id: string;
  guid: string;
  title: string;
  link: string;
  published_at: string;
  author: string;
  content_html: string;
  summary: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  feed: {
    feed_url: string;
    title: string;
    description: string;
    link: string;
    image_url: string;
    last_fetched_at: string;
    last_fetched_status: string;
    error_details: string;
    created_at: string;
    updated_at: string;
  };
}

interface BlogPostStore {
  blogPosts: BlogPost[];
  setBlogPosts: (blogPosts: BlogPost[]) => void;
  bookmarkedBlogPosts: BlogPost[];
  setBookmarkedBlogPosts: (bookmarkedBlogPosts: BlogPost[]) => void;
}

const useBlogPostStore = create<BlogPostStore>((set) => ({
  blogPosts: [],
  setBlogPosts: (blogPosts) => set({ blogPosts }),
  bookmarkedBlogPosts: [],
  setBookmarkedBlogPosts: (bookmarkedBlogPosts) => set({ bookmarkedBlogPosts }),
}));

export default useBlogPostStore;
