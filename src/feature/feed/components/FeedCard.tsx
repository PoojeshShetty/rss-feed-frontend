import React from 'react';
import { Plus, Check } from 'lucide-react';
import { RSSFeed } from '../../types';

interface FeedCardProps {
  feed: RSSFeed;
  isSubscribed: boolean;
  onSubscribe: (feedId: string) => void;
  onUnsubscribe: (feedId: string) => void;
  showSubscribeButton?: boolean;
}

export function FeedCard({
  feed,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  showSubscribeButton = true
}: FeedCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a
              href={feed.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {feed.title}
            </a>
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {feed.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-medium">
            {feed.category}
          </span>
          {isSubscribed && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
              Subscribed
            </span>
          )}
        </div>

        {showSubscribeButton && (
          <button
            onClick={() => isSubscribed ? onUnsubscribe(feed.id) : onSubscribe(feed.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isSubscribed
                ? 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200'
                : 'text-white bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubscribed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Subscribed</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}