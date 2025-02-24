import React from 'react'

const ListItem = ( { name, onClick } ) => {
    return (
	<a
	    href='#'
	    onClick={onClick}
	>
	    <li
		className='text-center p-4 bg-[#FDB439]/80 text-white text-xl font-semibold border-solid border-white border-b-4 hover:bg-[#FA9D39] duration-300'
	    >
		{name}
	    </li>
	</a>
    )
}

export default ListItem
