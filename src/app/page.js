import Image from "next/image";

import Button from '@/components/splash/Button'

export default function Home() {
  return (
    <div
			className='flex flex-col justify-center items-center h-[100vh] w-[100vw] bg-gradient-to-b from-[#DDD] to-[#FFF]'
		>

		<Image
			src='/logo.png'
			width='300'
			height='300'
			alt='chitchat'
			className=''
		 />

		<div 
			className='text-[6rem] text-[#FDB439] font-black pt-8 pb-4 drop-shadow-md'
		>
			ChitChat
		</div>

		
		<div
			className='flex gap-4'
		>
			<Button 
			  name='Login'
			  href='/login'
			/>
			<Button 
			  name='Sign up'
			  href='/signup'
			/>
			
		</div>

    </div>
  )
}
