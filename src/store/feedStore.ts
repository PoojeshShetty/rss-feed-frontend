import { create } from "zustand";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Feed {
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
  categories: Category[];
}

interface FeedStore {
  feeds: Feed[];
  setFeeds: (feeds: Feed[]) => void;
  subscribedFeeds: Feed[];
  setSubscribedFeeds: (subscribedFeeds: Feed[]) => void;
}

const useFeedStore = create<FeedStore>((set) => ({
  feeds: [],
  setFeeds: (feeds) => set({ feeds }),
  subscribedFeeds: [],
  setSubscribedFeeds: (subscribedFeeds) => set({ subscribedFeeds }),
}));

export default useFeedStore;
