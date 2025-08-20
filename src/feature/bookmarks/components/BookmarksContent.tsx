import React from "react";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { BlogPostCard } from "../../../components/blog/BlogPostCard";

interface BookmarksContentProps {
  groupedBookmarks: Record<string, { feed: any; posts: any[] }>;
  expandedFeeds: Set<string>;
  toggleFeedExpansion: (feedId: string) => void;
  handleUnbookmark: (postId: string) => void;
  handleShare: (postId: string) => void;
  onNavigate: (page: string, postId?: string) => void;
}

export function BookmarksContent({
  groupedBookmarks,
  expandedFeeds,
  toggleFeedExpansion,
  handleUnbookmark,
  handleShare,
  onNavigate,
}: BookmarksContentProps) {
  const bookmarkedPostObjects = Object.values(groupedBookmarks).flatMap(
    (group) => group.posts
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Bookmarked Posts ({bookmarkedPostObjects.length})
        </h2>
      </div>

      {bookmarkedPostObjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Bookmarked Posts Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't bookmarked any posts yet. Start reading and bookmark the
            posts you find interesting!
          </p>
          <button
            onClick={() => onNavigate("dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Posts
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBookmarks).map(([feedId, { feed, posts }]) => (
            <div
              key={feedId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Feed Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <button
                  onClick={() => toggleFeedExpansion(feedId)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feed?.title || "Unknown Feed"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {posts.length} bookmarked post
                        {posts.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {expandedFeeds.has(feedId) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Posts Grid */}
              {expandedFeeds.has(feedId) && (
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {posts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        onViewPost={(postId) => onNavigate("blog", postId)}
                        onShare={handleShare}
                        onUnbookmark={handleUnbookmark}
                        isBookmarked={true}
                        showBookmarkButton={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
