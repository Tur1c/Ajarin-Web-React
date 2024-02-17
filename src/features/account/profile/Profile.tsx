import React from 'react'
import { useLocation } from 'react-router-dom'
import { AccountOutput } from '../../../model/Account';

const Profile = () => {
  const location = useLocation();
  const account: AccountOutput = location.state;
  console.log(location.state.name,account, account.name,account.email);

  return (
    <div>Profile </div>
  )
}

export default Profile