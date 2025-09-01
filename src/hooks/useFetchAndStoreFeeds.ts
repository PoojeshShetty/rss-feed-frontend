import { useQuery, useQueryClient } from "@tanstack/react-query";
import useFeedStore from "../store/feedStore";
import { get } from "../utils/api";

const getFeeds = async () => {
  const data = await get("rss_feeds/");
  return data;
};

const getSubscribedFeeds = async () => {
  const data = await get("rss_feeds/subscribed");
  return data;
};

const useFetchAndStoreFeeds = () => {
  const setFeeds = useFeedStore((state) => state.setFeeds);
  const setSubscribedFeeds = useFeedStore((state) => state.setSubscribedFeeds);

  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const data = await getFeeds();
      setFeeds(data); // Update Zustand after successful fetch
      return data;
    },
    enabled: false
  });

  const subscribedQueryResult = useQuery({
    queryKey: ["subscribedFeeds"],
    queryFn: async () => {
      const data = await getSubscribedFeeds();
      setSubscribedFeeds(data); // Update Zustand after successful fetch
      return data;
    },
    enabled: false
  });

  return { queryResult, subscribedQueryResult };
};

export default useFetchAndStoreFeeds;
