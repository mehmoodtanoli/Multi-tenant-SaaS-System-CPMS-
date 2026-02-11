const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-backdrop">
      <div className="ui-modal">
        <div className="ui-modal-header">
          <h3>{title}</h3>
          <button className="ui-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
