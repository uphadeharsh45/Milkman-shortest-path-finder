import React from 'react'
import loading from './Loading.gif'

const Spinner=()=>{
    return (
      <div className='text-center'>
        <img src={loading} alt="loading" style={{width:'5vh'}}/>
      </div>
    )
  }

export default Spinner