import './alert.scss'

const Alert = ({setShowConfirm,handleAction,showConfirm,message,btnText}) => {
    
  return (
        <>
         {showConfirm && (
  <div className="confirm-modal">
    <div className="modal-content">
      <h2 className="modal-title">Are you sure?</h2>
      <p className="modal-message">{message}</p>
      <div className="modal-buttons">
        <button
          onClick={() => setShowConfirm(false)}
          className="modal-btn cancel"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            handleAction();
          }}
          className="modal-btn confirm"
        >
          {btnText}
        </button>
      </div>
    </div>
  </div>
)}
        </>
  )
}

export default Alert
