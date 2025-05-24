import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserInfo from "./UserInfo.jsx";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/loader/Loader";



function ProfilePage() {
  const data = useLoaderData();
  const {updateUser,currentUser} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();



  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await  apiRequest.post("/auth/logout");
      updateUser(null);
      showToast("Logout Successfully", 'success');
    // localStorage.removeItem("user");
    navigate("/");
      setIsLoading(false);
    }
    catch (err) {
      setIsLoading(false);
      showToast("Logout Failed", 'error');
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
          {isLoading ? <Loader message="Logging out..." /> : null}
          <UserInfo  currentUser={currentUser} handleLogout={handleLogout}/>
          <div className="title">
            <h1>My List</h1>
            <Link to="/post/update"> 
            <button>Create New Post</button>
            </Link>

          </div>
        <Suspense fallback={<Loader message="Loading Posts..." />}>
        <Await resolve={data.postResponse}
        errorElement={<Loader message="Error loading posts" />}
        >
          {(postResponse) => <List posts={postResponse.data.userPosts} canDelete={true}/>}
        </Await>
        </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>.
                  <Suspense fallback={<Loader message="Loading Saved Posts..." />}>
        <Await resolve={data.postResponse}
        errorElement={<Loader message="Error loading saved posts" />}
        >
          {(postResponse) => <List posts={postResponse.data.savedPosts}  canDelete={false}/>}
        </Await>
        </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
           <Suspense fallback={<Loader message="Loading Chats..." />}>
        <Await resolve={data.chatResponse}
        errorElement={<Loader message="Error loading chats" />}
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