import React, { useState } from "react";
import "./payment.css";
import Success from "../utils/success.png";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../GlobalFunctions/Auth";
import VerifyLockOpen from "../verifyLockOpen/VerifyLockOpen";
import LoginIcon from "@mui/icons-material/Login";
import bLogo from '../logos/tuckit_blue_text.png'

function PayementSuccess() {
  const Auth = useAuth();

  const onLogoutClick = () => {
    Auth.logoutHandler();
  };

  return (
    <>
      <div className="pay-success-container">
        <div className="success-wind">
          <div className="paymentSuccess-container">
            <img className="success-svg" src={Success} alt="img" width={100} />

          <div className="success-header-container">
            <h2 className="pay-success-header">Payment Successfull</h2>
            <h6>Thank you for using </h6> 
            <img src={bLogo} alt="*logo" width={100} />
            <h6>have a nice day</h6>
          </div>
          <div className="buttons-container">
            <Link to="/">
              {" "}
              <Button
                variant="contained"
                className="mui-btn-color-yellow"
                endIcon={<LoginIcon />}
                fullWidth
              >
                Choose Another Locker
              </Button>
            </Link>
          </div>
          <div className="buttons-container">
            <Button
              variant="contained"
              className="mui-btn-color"
              onClick={() => onLogoutClick()}
              endIcon={<LogoutIcon />}
              fullWidth
            >
              Close
            </Button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default PayementSuccess;
