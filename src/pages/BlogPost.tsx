import React from 'react';
import { Calendar, User, ExternalLink, Share2, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MessageBanner } from '../components/ui/MessageBanner';
import { useState } from 'react';

interface BlogPostProps {
  postId: string;
  onNavigate: (page: string) => void;
}

export function BlogPost({ postId, onNavigate }: BlogPostProps) {
  const { blogPosts, feeds, subscribe, subscribedFeeds, bookmarkedPosts, bookmarkPost, unbookmarkPost } = useApp();
  const { user } = useAuth();
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const post = blogPosts.find(p => p.id === postId);
  const sourceFeed = feeds.find(f => f.id === post?.sourceFeedId);
  const isSubscribed = sourceFeed && subscribedFeeds.includes(sourceFeed.id);
  const isBookmarked = post && bookmarkedPosts.includes(post.id);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#blog/${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setMessage({ type: 'success', text: 'Link copied to clipboard!' });
    });
  };

  const handleSubscribe = () => {
    if (!user) {
      setMessage({ type: 'info', text: 'Please log in to subscribe to feeds.' });
      return;
    }
    if (sourceFeed) {
      subscribe(sourceFeed.id);
      setMessage({ type: 'success', text: `Subscribed to ${sourceFeed.title}!` });
    }
  };

  const handleBookmark = () => {
    if (!user) {
      setMessage({ type: 'info', text: 'Please log in to bookmark posts.' });
      return;
    }
    
    if (isBookmarked) {
      unbookmarkPost(post.id);
      setMessage({ type: 'success', text: 'Bookmark removed.' });
    } else {
      bookmarkPost(post.id);
      setMessage({ type: 'success', text: 'Post bookmarked!' });
    }
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          {post.imageUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {post.sourceFeedName}
                  </span>
                  {!isSubscribed && sourceFeed && (
                    <button
                      onClick={handleSubscribe}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Subscribe to this feed
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {user && (
                    <button
                      onClick={handleBookmark}
                      className={`flex items-center space-x-1 px-3 py-1.5 transition-colors ${
                        isBookmarked
                          ? 'text-yellow-600 hover:text-yellow-700'
                          : 'text-gray-600 hover:text-yellow-600'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {post.author && (
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-sm"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Originally published on{' '}
                  <a
                    href={sourceFeed?.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {post.sourceFeedName}
                  </a>
                </div>
                
                <a
                  href={post.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span>Read Original</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </footer>
          </div>
        </article>

        {/* CTA for non-logged-in users */}
        {!user && (
          <div className="mt-8 text-center bg-blue-50 rounded-lg p-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Enjoying this content?
            </h3>
            <p className="text-blue-700 mb-4">
              Sign up to customize your feed, bookmark posts, and never miss great content like this!
            </p>
            <button
              onClick={() => onNavigate('login')}
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