import React from 'react';
import { Calendar, User, ExternalLink, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogPostCardProps {
  post: BlogPost;
  onViewPost: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onUnbookmark?: (postId: string) => void;
  isBookmarked?: boolean;
  showBookmarkButton?: boolean;
}

export function BlogPostCard({ 
  post, 
  onViewPost, 
  onShare, 
  onBookmark,
  onUnbookmark,
  isBookmarked = false,
  showBookmarkButton = true
}: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBookmarkClick = () => {
    if (isBookmarked && onUnbookmark) {
      onUnbookmark(post.id);
    } else if (!isBookmarked && onBookmark) {
      onBookmark(post.id);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {post.sourceFeedName}
          </span>
          <div className="flex items-center space-x-2">
            {showBookmarkButton && (
              <button
                onClick={handleBookmarkClick}
                className={`p-1.5 transition-colors ${
                  isBookmarked
                    ? 'text-yellow-600 hover:text-yellow-700'
                    : 'text-gray-400 hover:text-yellow-600'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => onShare(post.id)}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Share this post"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
          <button
            onClick={() => onViewPost(post.id)}
            className="hover:text-blue-600 transition-colors text-left"
          >
            {post.title}
          </button>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
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
          
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Original</span>
          </a>
        </div>
      </div>
    </article>
  );
}