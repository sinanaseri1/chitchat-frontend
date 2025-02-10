import React from 'react'
import Link from 'next/link'

const Button = ( { name, href } ) => {
	return (
		<Link 
			href={href}
			className='border-solid border-white text-white text-lg select-none font-bold border-4 py-2 px-7 rounded-full bg-gradient-to-b from-[#FDB439] to-[#FA9D39] hover:from-[#FA9D39] hover:to-[#FDB439] drop-shadow-lg hover:motion-safe:animate-bounce'
		>
			{name}
		</Link>
	)
}

export default Button
