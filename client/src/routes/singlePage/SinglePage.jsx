import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { singlePostData, userData } from "../../lib/dummydata";
import { redirect, useLoaderData ,useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../context/ToastContext";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const {currentUser} = useContext(AuthContext); 
  const navigator = useNavigate();
  const { showToast } = useToast();
  
  // console.log(post);
  const handleSave = async () => {
    // TODO:optimistics hook use ok later
    setSaved(!saved);
    try{
      if(!currentUser){
        showToast("Please login to save the post", 'error');
        redirect('/login');
      }
      await apiRequest.post('/users/save',{postId:post.id});
      showToast(saved ? "Post Removed from Saved" : "Post Saved", 'success');


    }catch(err){
      showToast("An error occurred while saving the post", 'error');
      console.log(err);
    setSaved(!saved);

    }
  }
  const handleMessageClick = async () => {
    if(!currentUser){
      showToast("Please login to send a message", 'error');
      redirect('/login');
    }
    if(currentUser.id == post.userId){
      showToast("You cannot send a message to yourself", 'error');
      navigator('/profile');
      return;
    }
    try{
      await apiRequest.post('/chats',{receiverId:post.userId});
      showToast("Redirecting to Chat", 'success');
      navigator('/profile');

    }catch(err){
      showToast("An error occurred while redirecting the message", 'error');
      console.log(err);
    }
  }
  
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar || './noavatar.jpg'} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(post.postDetail.desc)}}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {
                post.postDetail.utilities =="owner" ? (
                    <p>Owner is responsible</p>
                  ) : (
                    <p>Tenant is responsible</p>
                  )
                }
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {
                post.postDetail.pet == "allowed" ? (
                    <p>Pet Allowed</p>
                  ) : (
                    <p>Pet not Allowed</p>
                  )
                }
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Fees</span>
                <p>{
                   post.postDetail.income
                  }
                  </p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.beds} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bedroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{post.postDetail.school > 999 ? post.postDetail.school/1000 + 'km' :post.postDetail.school + 'm'} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus > 999 ? post.postDetail.bus/1000 + 'km' :post.postDetail.bus + 'm'} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant > 999 ? post.postDetail.restaurant/1000 + 'km' :post.postDetail.restaurant + 'm'} away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map data={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleMessageClick}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button onClick={handleSave} style={{backgroundColor:saved ? '#fece51' : 'white'}}>
              <img src="/save.png" alt="" />
            {saved ? 'Place Saved':' Save the Place'} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;