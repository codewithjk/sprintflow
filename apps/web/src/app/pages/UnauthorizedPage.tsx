import React from 'react'
import { useNavigate } from 'react-router-dom'

function UnauthorizedPage() {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
  return (
      <div>
          <p>You don't have access to this page </p>
          <button onClick={goBack}>Go Back</button>
    </div>
  )
}

export default UnauthorizedPage