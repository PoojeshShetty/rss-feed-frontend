import React from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { MessageBanner } from "../components/ui/MessageBanner";
import { useState } from "react";
import { BookmarksContent } from "../feature/bookmarks/components/BookmarksContent";

interface BookmarksProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function Bookmarks({ onNavigate }: BookmarksProps) {
  const { user } = useAuth();
  const { feeds, blogPosts, bookmarkedPosts, unbookmarkPost } = useApp();
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [expandedFeeds, setExpandedFeeds] = useState<Set<string>>(new Set());

  const bookmarkedPostObjects = blogPosts.filter((post) =>
    bookmarkedPosts.includes(post.id)
  );

  // Group bookmarked posts by feed
  const groupedBookmarks = bookmarkedPostObjects.reduce((acc, post) => {
    const feedId = post.sourceFeedId;
    if (!acc[feedId]) {
      acc[feedId] = {
        feed: feeds.find((f) => f.id === feedId),
        posts: [],
      };
    }
    acc[feedId].posts.push(post);
    return acc;
  }, {} as Record<string, { feed: unknown; posts: unknown[] }>);

  const handleUnbookmark = (postId: string) => {
    const post = blogPosts.find((p) => p.id === postId);
    unbookmarkPost(postId);
    setMessage({
      type: "success",
      text: `Removed "${post?.title || "post"}" from bookmarks.`,
    });
  };

  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/#blog/${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setMessage({ type: "success", text: "Link copied to clipboard!" });
    });
  };

  const toggleFeedExpansion = (feedId: string) => {
    const newExpanded = new Set(expandedFeeds);
    if (newExpanded.has(feedId)) {
      newExpanded.delete(feedId);
    } else {
      newExpanded.add(feedId);
    }
    setExpandedFeeds(newExpanded);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your bookmarked posts.
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
            My Bookmarks
          </h1>
          <p className="text-gray-600">
            Posts you've saved for later reading, organized by feed
          </p>
        </div>

        {/* Bookmarked Posts */}
        <BookmarksContent
          groupedBookmarks={groupedBookmarks}
          expandedFeeds={expandedFeeds}
          toggleFeedExpansion={toggleFeedExpansion}
          handleUnbookmark={handleUnbookmark}
          handleShare={handleShare}
          onNavigate={onNavigate}
        />

        {/* Helpful Info */}
        {bookmarkedPostObjects.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Pro Tip
            </h3>
            <p className="text-blue-800">
              Click on the feed headers above to expand or collapse the posts
              from each source. You can also share any bookmarked post with
              others using the share button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
