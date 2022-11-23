import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import serverUrl from "../GlobalVariable/serverUrl.json";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import YLogo from "../logos/logo_yellow.png";

function ForgotPasscode() {
  const RetriveAuth = useRetriveAuth();
  const [phoneNumber, setPhoneNumber] = useState(RetriveAuth.MobileNo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const verifyPasscodeUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PasscodeHandler";
  const phoneNumberHandler = (e) => {
    if (e.target.value.length > 10) {
    } else {
      setPhoneNumber(e.target.value);
    }
  };

  const sendOtpFunction = () => {
    
    setIsLoading(true)
    const data = {
      MobileNo: phoneNumber,
      PacketType: "retropenlocgetotp",
      terminalID:RetriveAuth.retriveLockContainer.terminalID
    };
    fetch(/* verifyPasscodeUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "RETOTP-200") {
          RetriveAuth.retriveMobileNoHandler(phoneNumber);
          navigate("/checkotp",{replace: true});
          setIsLoading(false)
        } else if (data.responseCode === "INVALIDMNO-201") {
          alert("invalid mobile number");
          setIsLoading(false)
        }
      })
      .catch((err) => {
        setIsLoading(false)
        console.log("err : " + err)
      });
  };

  return (
    <div className="retrive-page-container">
      <div className="forgot-passcode-wind" id="verifyOtp-win-id">
      <img className="logo-container" src={YLogo} alt="img" width={100} />
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="passcode-window">
            <div className="passcode-header">
              <h2>Verify Your Phone Number</h2>
            </div>
            <div className="form-container">
              <TextField
                type="number"
                label="mobile number"
                maxLength={4}
                name="MobileNo"
                variant="outlined"
                color="primary"
                value={phoneNumber}
                onChange={(e) => phoneNumberHandler(e)}
                required
                focused
                fullWidth
              />
            </div>

            {isLoading ? (
              <div className="btn-container">
                <LoadingButton
                  loading
                  loadingPosition="end"
                  endIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  generating otp ...
                </LoadingButton>
              </div>
            ) : (
              <div className="form-container">
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  className="mui-btn-color-yellow"
                  onClick={() => sendOtpFunction()}
                  fullWidth
                >
                  generate otp
                </Button>
              </div>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}

export default ForgotPasscode;
