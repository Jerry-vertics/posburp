// hooks/useUser.js
import { useState, useEffect } from 'react';

const useUser = () => {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    shiftstokens: '',
    userId: '',
    userRole: '',
    fullName: ''
  });

  useEffect(() => {
    const storedFirstname = localStorage.getItem('firstname') || '';
    const storedLastname = localStorage.getItem('lastname') || '';
    const storeid = localStorage.getItem("_id") || '';
    const storedtoken = localStorage.getItem('shifttoken') || '';
    const userRole = localStorage.getItem('userrole') || '';

    setUserData({
      firstname: storedFirstname,
      lastname: storedLastname,
      shiftstokens: storedtoken,
      userId: storeid,
      userRole: userRole,
      fullName: `${storedFirstname} ${storedLastname}`.trim() || 'User'
    });
  }, []);

  return userData;
};

export default useUser;