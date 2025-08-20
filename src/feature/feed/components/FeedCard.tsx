import { Plus, Check } from "lucide-react";
import { Feed } from "../types";

interface FeedCardProps {
  feed: Feed;
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
  showSubscribeButton = true,
}: FeedCardProps) {
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a
              href={feed.link}
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

      <div className="flex justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-500 flex-wrap capitalize">
          {feed.categories.map((item) => (
            <span
              key={item.id}
              className="inline-flex px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-medium mb-1"
            >
              {item.name}
            </span>
          ))}
        </div>

        {showSubscribeButton && (
          <button
            onClick={() =>
              isSubscribed ? onUnsubscribe(feed.id) : onSubscribe(feed.id)
            }
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isSubscribed
                ? "text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
                : "text-white bg-blue-600 hover:bg-blue-700"
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
