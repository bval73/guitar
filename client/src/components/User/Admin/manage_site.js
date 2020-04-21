import React from 'react';
import UserLayout from '../../../hoc/user'
import UpdateSiteInfo from './update_site_info';

const ManageSite = () => {
  return (
    <div>
      <UserLayout>
        <UpdateSiteInfo />
      </UserLayout>
    </div>
  );
};

export default ManageSite;
