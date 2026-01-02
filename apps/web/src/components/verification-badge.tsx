import { VerificationStatus } from "@oneguard/shared";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
}

export function VerificationBadge({ status, size = "md" }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const config = {
    [VerificationStatus.PASS]: {
      icon: <CheckCircle className={iconSizes[size]} />,
      text: "VERIFIED",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    [VerificationStatus.WARN]: {
      icon: <AlertTriangle className={iconSizes[size]} />,
      text: "WARNING",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    [VerificationStatus.FAIL]: {
      icon: <XCircle className={iconSizes[size]} />,
      text: "FAILED",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const { icon, text, className } = config[status];

  return (
    <div
      className={`inline-flex items-center gap-2 font-semibold border rounded ${sizeClasses[size]} ${className}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
