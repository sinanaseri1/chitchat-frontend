import React from "react";

const Stripe = ({ id, isActive }) => {
  // Base styling for each stripe
  const baseClasses = "bg-[#FDB439] w-[30px] h-[4px] rounded-full duration-300";

  // Build up conditional transforms
  let transformClasses = "";
  if (isActive) {
    if (id === 0) {
      transformClasses = "translate-y-[9px] rotate-45";
    } else if (id === 1) {
      transformClasses = "opacity-0";
    } else if (id === 2) {
      transformClasses = "-translate-y-[9px] -rotate-45";
    }
  }

  return <div className={`${baseClasses} ${transformClasses}`} />;
};

export default Stripe;
