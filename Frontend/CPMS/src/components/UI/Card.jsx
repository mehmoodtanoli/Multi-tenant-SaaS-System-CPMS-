const Card = ({ className = "", children }) => {
  return <div className={`ui-card ${className}`}>{children}</div>;
};

export default Card;
