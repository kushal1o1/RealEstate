import './alert.scss'

const Alert = ({setShowConfirm,handleDelete,showConfirm}) => {
    
  return (
        <>
         {showConfirm && (
  <div className="confirm-modal">
    <div className="modal-content">
      <h2 className="modal-title">Are you sure?</h2>
      <p className="modal-message">This action cannot be undone.</p>
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
            handleDelete();
          }}
          className="modal-btn confirm"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
        </>
  )
}

export default Alert
