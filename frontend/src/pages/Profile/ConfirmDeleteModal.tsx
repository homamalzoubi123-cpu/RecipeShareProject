interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeleteModal = ({
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <p>Möchtest du dieses Rezept wirklich löschen?</p>
        <div className="modal-actions">
          <button onClick={onClose}>Abbrechen</button>
          <button onClick={onConfirm}>Löschen</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
