import React from "react";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { BlogPostCard } from "../../../components/blog/BlogPostCard";
import { BlogPost } from "../../../types";

interface BookmarksContentProps {
  blogPosts: BlogPost[];
  expandedFeeds: Set<string>;
  toggleFeedExpansion: (feedId: string) => void;
  handleUnbookmark: (postId: string) => void;
  handleShare: (postId: string) => void;
  onNavigate: (page: string, postId?: string) => void;
}

export function BookmarksContent({
  blogPosts,
  handleUnbookmark,
  handleShare,
  onNavigate,
}: BookmarksContentProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Bookmarked Posts ({blogPosts.length})
        </h2>
      </div>

      {blogPosts.length === 0 ? (
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
        <div className="flex flex-wrap gap-4 size-lg">
          {blogPosts.map((post) => (
            <div className="w-2xl">
              <BlogPostCard
                key={post.id}
                post={post}
                onViewPost={(postId) => onNavigate("blog", postId)}
                onShare={handleShare}
                onUnbookmark={handleUnbookmark}
                isBookmarked={true}
                showBookmarkButton={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
