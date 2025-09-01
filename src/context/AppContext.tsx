import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppContextType, RSSFeed, BlogPost } from "../types";
import { mockFeeds, mockBlogPosts } from "../utils/mockData";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [feeds] = useState<RSSFeed[]>(mockFeeds);
  const [blogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [bookmarkedPosts, setBookmarkedPosts] = useLocalStorage<string[]>(
    "rss_bookmarked_posts",
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // const subscribe = (feedId: string) => {
  //   setSubscribedFeeds(prev => [...prev.filter(id => id !== feedId), feedId]);
  // };

  // const unsubscribe = (feedId: string) => {
  //   setSubscribedFeeds(prev => prev.filter(id => id !== feedId));
  // };

  const bookmarkPost = (postId: string) => {
    setBookmarkedPosts((prev) => [
      ...prev.filter((id) => id !== postId),
      postId,
    ]);
  };

  const unbookmarkPost = (postId: string) => {
    setBookmarkedPosts((prev) => prev.filter((id) => id !== postId));
  };

  const addCustomFeed = async (feedUrl: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call to validate and add feed
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, just return true
    setIsLoading(false);
    return true;
  };

  const refreshFeeds = async (): Promise<void> => {
    setIsLoading(true);

    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        feeds,
        blogPosts,
        bookmarkedPosts,
        bookmarkPost,
        unbookmarkPost,
        addCustomFeed,
        refreshFeeds,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
