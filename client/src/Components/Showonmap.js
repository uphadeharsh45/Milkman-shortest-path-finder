import React from 'react'
import { useLocation } from 'react-router-dom'

const Showonmap = () => {
    const { state } = useLocation();
    const { id, locations } = state;
    console.log("this is locations",locations);
  return (
    <div>
      this is show on map !
    </div>
  )
}

export default Showonmap
