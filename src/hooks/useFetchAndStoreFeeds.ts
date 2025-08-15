import { useQuery } from "@tanstack/react-query";
import useFeedStore from "../store/feedStore";
import { get } from "../utils/api";

const getFeeds = async () => {
  const data = await get("rss_feeds/");
  return data;
};

const useFetchAndStoreFeeds = () => {
  const setFeeds = useFeedStore((state) => state.setFeeds);

  const queryResult = useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const data = await getFeeds();
      setFeeds(data); // Update Zustand after successful fetch
      return data;
    },
  });

  return queryResult;
};

export default useFetchAndStoreFeeds;
