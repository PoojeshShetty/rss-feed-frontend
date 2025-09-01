import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { post, get } from "../utils/api";
import useSubscriptionStore from "../store/subscriptionStore";

const subscribeToFeed = async (data: unknown) => {
  const response = await post("user_subscriptions/", data);
  return response;
};

const unsubscribeFromFeed = async (data: unknown) => {
  const response = await post("user_subscription/unsubscribe/", data);
  return response;
};

const getUserSubscriptions = async () => {
  const data = await get("user_subscriptions/");
  return data;
};

const useFetchAndStoreSubscriptions = () => {
  const queryClient = useQueryClient();
  const setSubscriptions = useSubscriptionStore(
    (state) => state.setSubscriptions
  );

  const subscribeMutation = useMutation({
    mutationFn: subscribeToFeed,
    onSuccess: (newSubscription) => {
      // Option 2 (alt): Update Zustand directly (manual push)
      const currentSubscriptions =
        useSubscriptionStore.getState().subscriptions;
      const updatedSubscriptions = {
        ...currentSubscriptions,
        [newSubscription.feed_id]: newSubscription,
      };
      setSubscriptions(updatedSubscriptions);
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: unsubscribeFromFeed,
    onSuccess: (response) => {
      // Option 2 (alt): Update Zustand directly (manual push)
      const currentSubscriptions =
        useSubscriptionStore.getState().subscriptions;
      const { [response.feed_id]: _, ...updatedSubscriptions } = currentSubscriptions;
      setSubscriptions(updatedSubscriptions);
    },
  });

  const queryResult = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const data = await getUserSubscriptions();
      const normalizedData = data.reduce((acc, subscription) => {
        acc[subscription.feed_id] = subscription;
        return acc;
      }, {});
      setSubscriptions(normalizedData); // Update Zustand after successful fetch
      return normalizedData;
    },
  });

  return { subscribeMutation, unsubscribeMutation, queryResult };
};

export default useFetchAndStoreSubscriptions;
