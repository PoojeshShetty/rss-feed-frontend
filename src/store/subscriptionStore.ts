import { create } from "zustand";

interface Subscription {
  user_id: string;
  feed_id: string;
}

interface SubscriptionStore {
  subscriptions: { [feed_id: string]: Subscription };
  setSubscriptions: (subscriptions: {
    [feed_id: string]: Subscription;
  }) => void;
}

const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: {},
  setSubscriptions: (subscriptions) => set({ subscriptions }),
}));

export default useSubscriptionStore;
