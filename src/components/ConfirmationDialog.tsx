interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <div
      className="confirmation-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <section
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirmation-dialog-title">{title}</h2>
        <p id="confirmation-dialog-message">{message}</p>

        <div className="confirmation-actions">
          <button
            type="button"
            className="confirmation-cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirmation-delete-button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmationDialog;