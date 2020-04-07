import React from 'react';
import Button from '../utils/button';
import Login from './login';

const RegisterLogin = () => {
  return (
    <div className="page_wrapper">
      <div className="container">
        <div className="register_login_container">
          <div className="left">
            <h1>New Customers</h1>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras commodo tempor urna, in mattis augue. Integer dictum nunc ac magna varius hendrerit. Donec ultrices fringilla sem in vulputate. Sed turpis magna, condimentum semper ullamcorper at, euismod ac odio. Fusce ultricies consectetur magna quis fermentum. Nunc lobortis nibh odio, ac tincidunt libero rhoncus sit amet. Proin pulvinar porta lorem sit amet iaculis. Vivamus viverra libero mollis, faucibus lorem ut, venenatis nunc. Nulla ultrices interdum vehicula. 
            </p>
            <Button 
              title="Create An Account"
              type="default"
              linkTo="/register"
              addStyles={{
                margin: '10px 0 0 0'
              }}
            />
          </div>
          <div className="right">
              <h2>Registered Customers</h2>
              <p>If you have an account please log in</p>
              <Login />
          </div>

        </div>

      </div>
      
    </div>
  );
};

export default RegisterLogin;