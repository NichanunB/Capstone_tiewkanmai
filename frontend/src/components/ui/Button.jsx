// import PropTypes from "prop-types";

const Button = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }) => {
  const baseStyles = "rounded-lg font-medium transition duration-200 ease-in-out cursor-pointer";
  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  const variantStyles = {
    primary: "bg-[#3674B5] text-white hover:bg-[#2a5b8e]",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-[#3674B5] text-[#3674B5] hover:bg-[#3674B5]/10",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
