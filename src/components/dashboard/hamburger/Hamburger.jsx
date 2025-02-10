import React, { useState } from "react"

import Stripe from "./Stripe"

function Hamburger() {

 const [isActive, setIsActive] = useState(false)

  function doClick() {
    if(isActive) {
      document.getElementById('stripe-0').classList.remove('stripe-0-active')
      document.getElementById('stripe-1').classList.remove('stripe-1-active')
      document.getElementById('stripe-2').classList.remove('stripe-2-active')
      setIsActive(false)
    } else {
      document.getElementById('stripe-0').classList.add('stripe-0-active')
      document.getElementById('stripe-1').classList.add('stripe-1-active')
      document.getElementById('stripe-2').classList.add('stripe-2-active')
      setIsActive(true)
    }
  }

  return (
    <button
      className='flex flex-col gap-[5px]'
      onClick={doClick}
    >
        <Stripe id={0}/>
        <Stripe id={1}/>
        <Stripe id={2}/>
    </button>
  )
}

export default Hamburger;
