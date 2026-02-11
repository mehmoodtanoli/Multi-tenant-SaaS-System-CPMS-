const Badge = ({ variant = "default", children }) => {
  return <span className={`ui-badge ui-badge-${variant}`}>{children}</span>;
};

export default Badge;
