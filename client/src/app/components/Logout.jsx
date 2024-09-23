import React from 'react'
import { doLogout } from '../actions/actions'

const Logout = () => {
  return (
    <form action={doLogout}>
        <button className='bg-blue-500 p-2' type='submit'>Logout</button>
    </form>
  )
}

export default Logout
