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


export const listPageLoader = async ({ request,params }) => {
const query =request.url.split('?')[1];//provide 2 part as array before after '?'
console.log(query);
  const res =  apiRequest.get('/posts?'+query);
  return {postResponse :res,};
  // try {
  //   const res = await apiRequest.get('/posts/'+ params.id);
  //   return res.data;
  // } catch (error) {
  //   console.error("Error fetching post:", error);
  //   throw new Error("Failed to load post data");
  // }
}
