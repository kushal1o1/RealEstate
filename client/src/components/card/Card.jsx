import { Link } from "react-router-dom";
import "./card.scss";
import { useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import Alert from "../alert/Alert";
import { useToast } from "../../context/ToastContext";


function Card({ item ,canDelete=false}) {
  const {currentUser} = useContext(AuthContext); 
  const navigator = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();



  const handleDelete = async () => {
    try {
      await apiRequest.delete(`/posts/${item.id}`);
      window.location.reload();
      showToast("Post Deleted Successfully", 'success');

    } catch (err) {
      showToast("An error occurred while deleting the post", 'error');
      console.log(err);
    }
  };
    const handleMessageClick = async () => {
    if(!currentUser){
      redirect('/login');
    }
    if(currentUser.id == item.userId){
      navigator('/profile');
      return;
    }
    try{
      await apiRequest.post('/chats',{receiverId:item.userId});
      navigator('/profile');

    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className="card">
      <Alert handleAction={handleDelete} setShowConfirm={setShowConfirm} showConfirm={showConfirm} message='This action cannot be undone.' btnText="Yes,Delete"/>

      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
              {canDelete &&
              <>
            <div className='icon'>
              <img src="/delete.png" alt="delete" onClick={() => setShowConfirm(true)}/>
            </div>
            <div className="icon">
              <Link  to={`/post/update/${item.id}`}>
                <img src="/update.png" alt="update" />
              </Link>
              </div>
              </>
    }
            <div className="icon" onClick={handleMessageClick}>
              <img src="/chat.png" alt="update" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;