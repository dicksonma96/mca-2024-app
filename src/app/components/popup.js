import React from "react";

function Popup({
  children,
  title,
  confirmText = "Confirm",
  onConfirm,
  closeText = "Close",
  onClose,
  confirmDisable,
}) {
  return (
    <div className="overlay row" onClick={onClose}>
      <div
        className="window col"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>{title}</h1>
        <hr />
        {children}
        <div className="btns row">
          <div className="popup_btn cancel" onClick={onClose}>
            {closeText}
          </div>
          <button
            disabled={confirmDisable}
            onClick={onConfirm}
            className="popup_btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
