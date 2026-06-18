export interface Testimonials {
  id: string;
  name: string;
  slug: string;
  details: string;
  rating?: number;
//   image: string/
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  images:object[];

}