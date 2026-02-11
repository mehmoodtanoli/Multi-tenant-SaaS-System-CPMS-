const Input = ({ label, className = "", ...props }) => {
  return (
    <label className={`ui-input ${className}`}>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
};

export default Input;
