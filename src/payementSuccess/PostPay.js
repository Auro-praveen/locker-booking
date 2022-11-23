import React, { useState } from "react";
import { Button } from "@mui/material";
import { useAuth } from "../GlobalFunctions/Auth";
import VerifyLockOpen from "../verifyLockOpen/VerifyLockOpen";

function PostPay() {
  const Auth = useAuth();


  const logoutHandler = () => {
    Auth.logoutHandler();
  };

  return (
    <>

      <div className="post-pay-container">
      <h2 className="item-header">Your Locker is open</h2>
      <h5 className="item-sub-header">you can pay while retriving our lock</h5>

      <div className="btn-container-post">
        <Button
          variant="contained"
          color="secondary"
          className="btn-group"
          onClick={() => logoutHandler()}
          fullWidth
        >
          logout
        </Button>
      </div>
    </div>
    

    </>

  );
}

export default PostPay;
