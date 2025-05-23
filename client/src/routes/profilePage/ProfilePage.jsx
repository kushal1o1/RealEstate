import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserInfo from "./UserInfo.jsx";

function ProfilePage() {
  const data = useLoaderData();
  const {updateUser,currentUser} = useContext(AuthContext);

  const navigate = useNavigate();



  const handleLogout = async () => {
    try {
      await  apiRequest.post("/auth/logout");
      updateUser(null);
    // localStorage.removeItem("user");
    navigate("/");
    }
    catch (err) {
      console.error(err);
    }
  };

  return (

    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
            <button>Update Profile</button>
            </Link>
          </div>

          <UserInfo  currentUser={currentUser} handleLogout={handleLogout}/>
          <div className="title">
            <h1>My List</h1>
            <Link to="/post/update"> 
            <button>Create New Post</button>
            </Link>

          </div>
        <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.postResponse}
        errorElement={<div>Error loading posts</div>}
        >
          {(postResponse) => <List posts={postResponse.data.userPosts} canDelete={true}/>}
        </Await>
        </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>.
                  <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.postResponse}
        errorElement={<div>Error loading posts</div>}
        >
          {(postResponse) => <List posts={postResponse.data.savedPosts}  canDelete={false}/>}
        </Await>
        </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
           <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.chatResponse}
        errorElement={<div>Error loading Chats</div>}
        >
          
          {(chatResponse) =>  <Chat chats={chatResponse.data}/>}
        </Await>
        </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;