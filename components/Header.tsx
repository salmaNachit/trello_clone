'use client'
import React from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/16/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/Store/BoardStore'

type Props = {}

const Header = (props: Props) => {
    const [searchString, setSearchString] = useBoardStore((state) => [
        state.searchString,
        state.setSearchString,
    ])
  return (
    <header> 
        <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
            <div
            className='
            absolute
            top-0
            left-0
            w-full
            h-96
            bg-gradient-to-br
            from-pink-400
            to-[#0055D1]
            rounded-md
            filter
            blur-3xl
            opacity-50
            -z-50
            '
            />
            
            <div className='flex items-center justify-end space-x-5 w-full flex-1'>
                <form action="" className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
                    <MagnifyingGlassIcon className='h-6 w-6 text-gray-400'/>
                    <input type="text"
                    placeholder='Search'
                    value={searchString}
                    onChange={e=> setSearchString(e.target.value)}
                    className='flex-1 outline-none p-2' />
                    <button type='submit' hidden> Search</button>
                </form>
                <Avatar name='salma nachit' round size='50'/>
            </div>
        </div>
        <div className='items-center justify-center py-10 px-5 md:py-5'>
            <p className='flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-blue-600'>
                <UserCircleIcon className='inline-block h-10 w-30 mr-1 text-blue-700'/>
                chat-gpt ......
            </p>
        </div>
    </header>
  )
}

export default Header