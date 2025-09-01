import React, { useEffect, useState } from "react";
import { Plus, Trash2, Rss } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { FeedCard } from "../feature/feed/components/FeedCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { MessageBanner } from "../components/ui/MessageBanner";
import useFeedStore from "../store/feedStore";
import useFetchAndStoreFeeds from "../hooks/useFetchAndStoreFeeds";

interface SubscriptionsProps {
  onNavigate: (page: string) => void;
}

export function Subscriptions({ onNavigate }: SubscriptionsProps) {
  const { user } = useAuth();
  const { unsubscribe, addCustomFeed } = useApp();

  const { subscribedFeeds } = useFeedStore();
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // fetch feeds
  const { subscribedQueryResult } = useFetchAndStoreFeeds();

  useEffect(() => {
    subscribedQueryResult.refetch();
  }, []);
  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFeedUrl.trim()) {
      setMessage({ type: "error", text: "Please enter a valid RSS feed URL." });
      return;
    }

    // Basic URL validation
    try {
      new URL(newFeedUrl);
    } catch {
      setMessage({ type: "error", text: "Please enter a valid URL." });
      return;
    }

    setIsAddingFeed(true);

    try {
      const success = await addCustomFeed(newFeedUrl);
      if (success) {
        setMessage({ type: "success", text: "Feed added successfully!" });
        setNewFeedUrl("");
      } else {
        setMessage({
          type: "error",
          text: "Failed to add feed. Please check the URL and try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while adding the feed.",
      });
    } finally {
      setIsAddingFeed(false);
    }
  };

  const handleUnsubscribe = (feedId: string) => {
    const feed = feeds.find((f) => f.id === feedId);
    unsubscribe(feedId);
    setMessage({
      type: "success",
      text: `Unsubscribed from ${feed?.title || "feed"}.`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to manage your subscriptions.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Subscriptions
          </h1>
          <p className="text-gray-600">
            Manage your RSS feed subscriptions and add new ones
          </p>
        </div>

        {/* Add New Feed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Feed
          </h2>
          <form
            onSubmit={handleAddFeed}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="url"
                placeholder="Enter RSS feed URL (e.g., https://example.com/feed.xml)"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAddingFeed}
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAddingFeed ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Feed</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Subscribed Feeds */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Subscriptions ({subscribedFeeds.length})
            </h2>
          </div>

          {subscribedFeeds.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Active Subscriptions
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't subscribed to any feeds yet. Start by exploring our
                curated feeds or adding a custom one above.
              </p>
              <button
                onClick={() => onNavigate("explore")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Explore Feeds
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscribedFeeds.map((feed) => (
                <div key={feed.id} className="relative">
                  <FeedCard
                    feed={feed}
                    isSubscribed={true}
                    onSubscribe={() => {}}
                    onUnsubscribe={handleUnsubscribe}
                    showSubscribeButton={false}
                  />
                  <button
                    onClick={() => handleUnsubscribe(feed.id)}
                    className="absolute top-2 right-2 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                    title="Unsubscribe from this feed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
