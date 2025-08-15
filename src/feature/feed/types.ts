export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Feed {
  id: string;
  feed_url: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
  last_fetched_at: string;
  last_fetched_status: string;
  error_details: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
}
