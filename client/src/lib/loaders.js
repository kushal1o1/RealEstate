import  apiRequest  from './apiRequest.js';

export const singlePageLoader = async ({ request,params }) => {
  try {
    const res = await apiRequest.get('/posts/'+ params.id);
    return res.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Failed to load post data");
  }
}