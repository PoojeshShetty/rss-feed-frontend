import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { MessageBanner } from "../components/ui/MessageBanner";
import useFetchAndStoreBlogPosts from "../hooks/useFetchAndStoreBlogPosts";
import useBlogPostStore from "../store/blogPostStore";
import { DashboardContent } from "../feature/dashboard/components/DashboardContent";
import { DashboardControls } from "../feature/dashboard/components/DashboardControls";
import { DashboardWelcome } from "../feature/dashboard/components/DashboardWelcome";
import useFetchAndStoreSubscriptions from "../hooks/useFetchAndStoreSubscriptions";
import useSubscriptionStore from "../store/subscriptionStore";

interface DashboardProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const {
    feeds,
    bookmarkedPosts,
    refreshFeeds,
    isLoading,
    bookmarkPost,
    unbookmarkPost,
  } = useApp();
  const { blogPosts } = useBlogPostStore();
  const { subscriptions } = useSubscriptionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeed, setSelectedFeed] = useState("all");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const subscribeMutation = useFetchAndStoreSubscriptions();

  const { isLoading: isFetchingBlogPosts, isError } =
    useFetchAndStoreBlogPosts();

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      // Filter by subscription
      if (!user) return true; // Show all posts if not logged in

      // Filter by selected feed
      if (selectedFeed !== "all" && post.feed_id !== selectedFeed) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.summary.toLowerCase().includes(query) ||
          post.feed.title.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [blogPosts, selectedFeed, searchQuery, user]);

  const handleRefresh = async () => {
    try {
      await refreshFeeds();
      setMessage({ type: "success", text: "Feeds refreshed successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to refresh feeds. Please try again.",
      });
    }
  };

  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/#blog/${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setMessage({ type: "success", text: "Link copied to clipboard!" });
    });
  };

  const handleBookmark = (postId: string) => {
    if (!user) {
      setMessage({ type: "info", text: "Please log in to bookmark posts." });
      return;
    }
    bookmarkPost(postId);
    setMessage({ type: "success", text: "Post bookmarked!" });
  };

  const handleUnbookmark = (postId: string) => {
    unbookmarkPost(postId);
    setMessage({ type: "success", text: "Bookmark removed." });
  };

  const handleSubscribe = (feedId: string) => {
    if (!user) {
      setMessage({
        type: "info",
        text: "Please log in to subscribe to feeds.",
      });
      return;
    }

    subscribeMutation.mutate(
      { user_id: "dummy_user_id", feed_id: feedId },
      {
        onSuccess: () => {
          setMessage({
            type: "success",
            text: "Successfully subscribed to feed!",
          });
        },
        onError: () => {
          setMessage({ type: "error", text: "Failed to subscribe to feed." });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {message && (
        <MessageBanner
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
          fixed={true}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardWelcome user={user} />
        <DashboardControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFeed={selectedFeed}
          setSelectedFeed={setSelectedFeed}
          handleRefresh={handleRefresh}
          isLoading={isLoading}
          isFetchingBlogPosts={isFetchingBlogPosts}
          user={user}
          subscribedFeedObjects={subscriptions}
        />
        <DashboardContent
          filteredPosts={filteredPosts}
          onNavigate={onNavigate}
          handleShare={handleShare}
          handleBookmark={handleBookmark}
          handleUnbookmark={handleUnbookmark}
          bookmarkedPosts={bookmarkedPosts}
          user={user}
          isLoading={isLoading}
          isFetchingBlogPosts={isFetchingBlogPosts}
        />
      </div>
    </div>
  );
}
