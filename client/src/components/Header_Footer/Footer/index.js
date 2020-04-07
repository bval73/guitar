import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCompass from '@fortawesome/fontawesome-free-solid/faCompass';
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';

const Footer = () => {
  return (
    <footer className="bck_b_dark">
      <div className="container">
        <div className="logo">
          Guitars
        </div>
        <div className="wrapper">
          <div className="left">
            <h2>Contace Information</h2>
            <div className="business_nfo">
              <div className="tag">
                <FontAwesomeIcon
                  icon={faCompass}
                  className="icon"
                />
                <div className="nfo">
                  <div>Address</div>
                  <div>1313 Mocking Bird Ln.</div>
                </div>
              </div>

              <div className="tag">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="icon"
                />
                <div className="nfo">
                  <div>Phone</div>
                  <div>666-666-1313</div>
                </div>
              </div>

              <div className="tag">
                <FontAwesomeIcon
                  icon={faClock}
                  className="icon"
                />
                <div className="nfo">
                  <div>Working Hours</div>
                  <div>Mon - Sun 8am - 6pm</div>
                </div>
              </div>

              <div className="tag">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="icon"
                />
                <div className="nfo">
                  <div>EMail</div>
                  <div>info@guitars.com</div>
                </div>
              </div>

            </div>
          </div>
          <div className="left">
            <h2>Be the first to know</h2>
            <div>Get all the latest information on events, sales and offers. </div>
          </div>
        </div>
      </div>
      
      
    </footer>
  );
};

export default Footer;