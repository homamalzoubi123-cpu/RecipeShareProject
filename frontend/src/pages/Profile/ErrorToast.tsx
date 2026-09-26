interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast = ({ message, onClose }: ErrorToastProps) => {
  return (
    <div className="error-toast">
      {message}
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default ErrorToast;
