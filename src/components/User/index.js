import React from 'react';
import UserLayout from '../../hoc/user';
import Button from '../utils/button';

const UserDashboard = ({user}) => {
  
  return (
    <UserLayout>
      <div>
        <div className="user_nfo_panel">
          <h1>User Information</h1>
          <div>
            <span>{user.userData.name}</span>
            <span>{user.userData.lastname}</span>
            <span>{user.userData.email}</span>
          </div>
            <Button 
              title="Edit Account Information"
              type="default"
              linkTo="/user/user_profile"
            />
        </div>

        <div className="user_nfo_panel">
          <h1>History Purchases</h1>
          <div className="user_product_block_wrapper">
            History
          </div>
        </div>
      </div>
    </UserLayout>
    
  );
};

export default UserDashboard;