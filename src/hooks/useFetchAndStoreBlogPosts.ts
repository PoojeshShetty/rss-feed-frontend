import { useQuery } from "@tanstack/react-query";
import useBlogPostStore from "../store/blogPostStore";
import { get } from "../utils/api";

const getBlogPosts = async () => {
  const data = await get("blog_posts/");
  return data;
};

const useFetchAndStoreBlogPosts = () => {
  const setBlogPosts = useBlogPostStore((state) => state.setBlogPosts);

  const queryResult = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const data = await getBlogPosts();
      setBlogPosts(data); // Update Zustand after successful fetch
      return data;
    },
  });

  return queryResult;
};

export default useFetchAndStoreBlogPosts;
