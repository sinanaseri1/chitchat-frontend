import React from 'react'

const Stripe = ( { id, isTransformed } ) => {

    return <div
        id={`stripe-${id}`}
        className='bg-[#FDB439] w-[30px] h-[4px] rounded-full duration-300'
    >
    </div>
}

export default Stripe