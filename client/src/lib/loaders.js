import  apiRequest  from './apiRequest.js';
import { redirect } from 'react-router-dom';
export const singlePageLoader = async ({ request,params }) => {
  try {
    const res = await apiRequest.get('/posts/'+ params.id);
    return res.data;
  } catch (error) {
    console.error("Error fetching post:", error);
     throw redirect('/login');
  }
}


export const listPageLoader = async ({ request,params }) => {
const query =request.url.split('?')[1];//provide 2 part as array before after '?'
  const res =  apiRequest.get('/posts?'+query);
  return {postResponse :res,};
}

export const profilePageLoader = async () => {

  const res =  apiRequest.get('/users/profilePosts');
  const chatPromise =  apiRequest.get('/chats');

  return {postResponse :res,
          chatResponse :chatPromise,
  };
}
