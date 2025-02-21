import React from "react";
import Stripe from "./Stripe";

function Hamburger({ menuOpen, setMenuOpen }) {
  const handleClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <button className="flex flex-col gap-[5px] mr-10" onClick={handleClick}>
      {/* Pass an id and "isActive" to each Stripe */}
      <Stripe id={0} isActive={menuOpen} />
      <Stripe id={1} isActive={menuOpen} />
      <Stripe id={2} isActive={menuOpen} />
    </button>
  );
}

export default Hamburger;
