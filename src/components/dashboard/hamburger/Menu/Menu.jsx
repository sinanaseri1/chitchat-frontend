import React from 'react'
import ListItem from './ListItem'
import { useRouter } from "next/navigation";
import { revalidatePath } from 'next/cache'

const Menu = ({ selectedFriend }) => {


const router = useRouter();

  const deleteHistory = async () => {

    if (selectedFriend == null) {
      alert('No Chat Selected')
      return
    }
    
    const response = await fetch(`http://localhost:3001/messages/delete/${selectedFriend._id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => console.log(data))

    //reget messages instead of refreshing?
    router.push("/dashboard")
    
    //console.log(selectedFriend)
    
  }

  return (
    <div
      // Added top/right positioning, a background color, and z-index for visibility
      className='absolute top-0 right-8 w-[max-content] min-w-[240px] bg-white border-solid border-white border-x-4 shadow-lg z-50'
    >
      <ul>
        <ListItem name="Delete History" onClick={deleteHistory} />
        {/*
        <ListItem name='Add User' />
        <ListItem name='Delete User' />
        <ListItem name='Block User' />
        */}
      </ul>
    </div>
  )
}

export default Menu
