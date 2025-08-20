import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FeedCard } from "../feature/feed/components/FeedCard";
import { MessageBanner } from "../components/ui/MessageBanner";
import { categories } from "../utils/mockData";
import useFetchAndStoreFeeds from "../hooks/useFetchAndStoreFeeds";
import useFeedStore from "../store/feedStore";
import useFetchAndStoreSubscriptions from "../hooks/useFetchAndStoreSubscriptions";
import useSubscriptionStore from "../store/subscriptionStore";

interface ExploreProps {
  onNavigate: (page: string) => void;
}

export function Explore({ onNavigate }: ExploreProps) {
  const { user } = useAuth();
  const { feeds } = useFeedStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const { queryResult, subscribedQueryResult } = useFetchAndStoreFeeds();
  const { subscribeMutation, unsubscribeMutation } =
    useFetchAndStoreSubscriptions();
  const subscibedFeeds = useSubscriptionStore();

  useEffect(() => {
    queryResult.refetch();
  }, []);

  const filteredFeeds = useMemo(() => {
    return feeds.filter((feed) => {
      // Filter by category
      // if (selectedCategory !== 'All' && feed.category !== selectedCategory) return false;

      // Filter by search query
      // if (searchQuery) {
      //   const query = searchQuery.toLowerCase();
      //   return (
      //     feed.title.toLowerCase().includes(query) ||
      //     feed.description.toLowerCase().includes(query)
      //   );
      // }

      return true;
    });
  }, [feeds, selectedCategory, searchQuery]);

  const handleSubscribe = (feedId: string) => {
    if (!user) {
      setMessage({
        type: "info",
        text: "Please log in to subscribe to feeds.",
      });
      return;
    }
    subscribeMutation.mutate(
      { feed_id: feedId },
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

  const handleUnsubscribe = (feedId: string) => {
    if (!user) {
      setMessage({
        type: "info",
        text: "Please log in to unsubscribe from feeds.",
      });
      return;
    }
    unsubscribeMutation.mutate(
      { feed_id: feedId },
      {
        onSuccess: () => {
          setMessage({
            type: "success",
            text: "Successfully unsubscribed from feed!",
          });
        },
        onError: () => {
          setMessage({
            type: "error",
            text: "Failed to unsubscribe from feed.",
          });
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Feeds
          </h1>
          <p className="text-gray-600">
            Discover interesting RSS feeds across various categories
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search feeds by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Mobile-friendly alternative) */}
        <div className="flex flex-wrap gap-2 mb-8 lg:hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredFeeds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No feeds found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredFeeds.length} feed
                {filteredFeeds.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feeds.map((feed) => (
                <FeedCard
                  key={feed.id}
                  feed={feed}
                  isSubscribed={!!subscibedFeeds.subscriptions[feed.id]}
                  onSubscribe={handleSubscribe}
                  onUnsubscribe={handleUnsubscribe}
                />
              ))}
            </div>
          </>
        )}

        {/* CTA for non-logged-in users */}
        {!user && (
          <div className="mt-12 text-center bg-blue-50 rounded-lg p-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Get the Most Out of RSS Reader
            </h3>
            <p className="text-blue-700 mb-4">
              Sign up to subscribe to feeds, bookmark favorites, and create your
              personalized dashboard.
            </p>
            <button
              onClick={() => onNavigate("login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
