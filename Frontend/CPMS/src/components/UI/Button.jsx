const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  return (
    <button className={`ui-button ui-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
