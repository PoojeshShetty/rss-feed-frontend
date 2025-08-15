import React from "react";
import { BlogPostCard } from "../../../components/blog/BlogPostCard";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

interface DashboardContentProps {
  filteredPosts: any[];
  onNavigate: (page: string, postId?: string) => void;
  handleShare: (postId: string) => void;
  handleBookmark: (postId: string) => void;
  handleUnbookmark: (postId: string) => void;
  bookmarkedPosts: string[];
  user: any;
  isLoading: boolean;
  isFetchingBlogPosts: boolean;
}

export function DashboardContent({
  filteredPosts,
  onNavigate,
  handleShare,
  handleBookmark,
  handleUnbookmark,
  bookmarkedPosts,
  user,
  isLoading,
  isFetchingBlogPosts,
}: DashboardContentProps) {
  return (
    <div>
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
  );
}
