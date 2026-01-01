// components/common/Logo.tsx
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  showText?: boolean;
  text?: string;
  className?: string;
  linkTo?: string;
  onClick?: () => void;
  alt?: string;
  containerClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = false,
  text = "Tesla",
  className = "",
  linkTo,
  onClick,
  alt = "Tesla Logo",
  containerClassName = "",
}) => {
  // Handle size props
  const getSizeClasses = () => {
    if (typeof size === "number") {
      return { width: size, height: size };
    }

    const sizeMap = {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-20 w-20",
    };
    return sizeMap[size];
  };

  const sizeClasses = getSizeClasses();

  // Logo image
  const logoImage = (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
      alt={alt}
      className={`${
        typeof sizeClasses === "string" ? sizeClasses : ""
      } object-contain tesla-red-filter ${className}`}
      style={typeof sizeClasses === "object" ? sizeClasses : undefined}
    />
  );

  // Logo content
   const logoContent = showText ? (
     <div
       className={`flex items-center justify-center gap-3 ${containerClassName}`}
     >
       {logoImage}
       <span className="font-bold text-white text-xl">{text}</span>
     </div>
   ) : (
     <div
       className={`inline-flex items-center justify-center ${containerClassName}`}
     >
       {logoImage}
     </div>
   );

  // Render with link if provided
  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className=" focus:outline-none">
        {logoContent}
      </button>
    );
  }

  return <div className="flex items-center justify-center">{logoContent}</div>;
};

export default Logo;
