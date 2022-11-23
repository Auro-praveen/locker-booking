import React from "react";
import Success from "../../utils/success.png";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import "./retriveSuccess.css";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import TuckitTextLogo from '../../logos/tuckit_blue_text.png'
import { useAuth } from "../../GlobalFunctions/Auth";

function RetriveSuccess() {
  const RetriveAuth = useRetriveAuth();
  const Auth = useAuth();
  const onLogoutClick = () => {
    Auth.logoutHandler();
    RetriveAuth.logoutHandler();
  };
  return (
    <>
      <div className="retr-success-container">
        <div className="retr-success-wind">
          <div className="paymentSuccess-container">
            <img className="success-svg" src={Success} alt="img" width={100} />
          </div>
          <div className="success-header-container">
            <h4>
              Thank you for using
              
              {/* <strong className="brand-name">TUCKIT</strong>{" "} */}
            </h4>
            <img className="tuckit-text-logo" src={TuckitTextLogo} alt="log" width={100} />
            <h6>have a nice day !</h6>
          </div>
          <br />

          <div className="buttons-container">
          <Button
            variant="contained"
            color="secondary"
            className="mui-btn-color-yellow"
            onClick={() => onLogoutClick()}
            endIcon={<LogoutIcon />}
            fullWidth
          >
            Close
          </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RetriveSuccess;
