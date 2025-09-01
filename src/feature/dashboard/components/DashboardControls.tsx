import React from "react";
import { Search, RefreshCw, Filter } from "lucide-react";

interface DashboardControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFeed: string;
  setSelectedFeed: (feedId: string) => void;
  handleRefresh: () => void;
  isLoading: boolean;
  isFetchingBlogPosts: boolean;
  user: any;
  subscribedFeedObjects: Record<string, unknown>;
  feeds: any[];
}

export function DashboardControls({
  searchQuery,
  setSearchQuery,
  selectedFeed,
  setSelectedFeed,
  handleRefresh,
  isLoading,
  isFetchingBlogPosts,
  user,
  subscribedFeedObjects,
  feeds,
}: DashboardControlsProps) {
  return (
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
        {user && feeds?.length > 0 && (
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedFeed}
              onChange={(e) => setSelectedFeed(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Feeds</option>
              {/* {feeds.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.title}
                </option>
              ))} */}
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
  );
}
