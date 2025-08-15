import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { BlogPostCard } from "../components/blog/BlogPostCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { MessageBanner } from "../components/ui/MessageBanner";
import useFetchAndStoreBlogPosts from "../hooks/useFetchAndStoreBlogPosts";
import useBlogPostStore from "../store/blogPostStore";

interface DashboardProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const {
    feeds,
    subscribedFeeds,
    bookmarkedPosts,
    refreshFeeds,
    isLoading,
    bookmarkPost,
    unbookmarkPost,
  } = useApp();
  const { blogPosts } = useBlogPostStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeed, setSelectedFeed] = useState("all");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const { isLoading: isFetchingBlogPosts, isError } =
    useFetchAndStoreBlogPosts();

  const subscribedFeedObjects = feeds.filter((feed) =>
    subscribedFeeds.includes(feed.id)
  );
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      // Filter by subscription
      const isFromSubscribedFeed = subscribedFeeds.includes(post.feed_id);
      if (!user) return true; // Show all posts if not logged in
      if (!isFromSubscribedFeed) return false;

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
  }, [blogPosts, subscribedFeeds, selectedFeed, searchQuery, user]);

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user
              ? `Welcome back, ${user.displayName}!`
              : "Welcome to RSS Reader"}
          </h1>
          <p className="text-gray-600">
            {user
              ? "Stay up to date with your favorite feeds"
              : "Discover and follow your favorite content sources"}
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog titles and descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Feed Filter */}
            {user && subscribedFeedObjects.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedFeed}
                  onChange={(e) => setSelectedFeed(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Feeds</option>
                  {subscribedFeedObjects.map((feed) => (
                    <option key={feed.id} value={feed.id}>
                      {feed.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading || isFetchingBlogPosts}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isLoading || isFetchingBlogPosts ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading || isFetchingBlogPosts ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            {user && subscribedFeeds.length === 0 ? (
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Subscriptions Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't subscribed to any feeds yet. Explore new feeds or
                  add your first one!
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate("explore")}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Explore Feeds
                  </button>
                  <button
                    onClick={() => onNavigate("subscriptions")}
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Add Custom Feed
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.guid}
                post={post}
                onViewPost={(postId) => onNavigate("blog", postId)}
                onShare={handleShare}
                onBookmark={handleBookmark}
                onUnbookmark={handleUnbookmark}
                isBookmarked={bookmarkedPosts.includes(post.guid)}
                showBookmarkButton={!!user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
