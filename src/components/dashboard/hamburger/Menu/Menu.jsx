import React from 'react'

import ListItem from './ListItem'

const Menu = () => {
    return (
			<div 
        className='absolute w-[max-content] min-w-[240px] border-solid border-white border-x-4 shadow-lg'
			>
				<ul>
					<ListItem name='Add User' />
					<ListItem name='Delete User' />
					<ListItem name='Block User' />
				</ul>
    </div>
	)
}

export default Menu
