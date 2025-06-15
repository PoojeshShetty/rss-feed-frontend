import React from 'react';
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BlogPostCard } from '../components/blog/BlogPostCard';
import { MessageBanner } from '../components/ui/MessageBanner';
import { useState } from 'react';

interface BookmarksProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function Bookmarks({ onNavigate }: BookmarksProps) {
  const { user } = useAuth();
  const { 
    feeds, 
    blogPosts,
    bookmarkedPosts, 
    unbookmarkPost 
  } = useApp();
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [expandedFeeds, setExpandedFeeds] = useState<Set<string>>(new Set());

  const bookmarkedPostObjects = blogPosts.filter(post => bookmarkedPosts.includes(post.id));

  // Group bookmarked posts by feed
  const groupedBookmarks = bookmarkedPostObjects.reduce((acc, post) => {
    const feedId = post.sourceFeedId;
    if (!acc[feedId]) {
      acc[feedId] = {
        feed: feeds.find(f => f.id === feedId),
        posts: []
      };
    }
    acc[feedId].posts.push(post);
    return acc;
  }, {} as Record<string, { feed: any; posts: any[] }>);

  const handleUnbookmark = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    unbookmarkPost(postId);
    setMessage({ type: 'success', text: `Removed "${post?.title || 'post'}" from bookmarks.` });
  };

  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/#blog/${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setMessage({ type: 'success', text: 'Link copied to clipboard!' });
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your bookmarked posts.
          </p>
          <button
            onClick={() => onNavigate('login')}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
          <p className="text-gray-600">
            Posts you've saved for later reading, organized by feed
          </p>
        </div>

        {/* Bookmarked Posts */}
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
                You haven't bookmarked any posts yet. Start reading and bookmark the posts you find interesting!
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Posts
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedBookmarks).map(([feedId, { feed, posts }]) => (
                <div key={feedId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                            {feed?.title || 'Unknown Feed'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {posts.length} bookmarked post{posts.length !== 1 ? 's' : ''}
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
                        {posts.map(post => (
                          <BlogPostCard
                            key={post.id}
                            post={post}
                            onViewPost={(postId) => onNavigate('blog', postId)}
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

        {/* Helpful Info */}
        {bookmarkedPostObjects.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Pro Tip
            </h3>
            <p className="text-blue-800">
              Click on the feed headers above to expand or collapse the posts from each source.
              You can also share any bookmarked post with others using the share button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}