import React from 'react'
import ListItem from './ListItem'

const Menu = () => {
  return (
    <div
      // Added top/right positioning, a background color, and z-index for visibility
      className='absolute top-[60px] right-4 w-[max-content] min-w-[240px] bg-white border-solid border-white border-x-4 shadow-lg z-50'
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
