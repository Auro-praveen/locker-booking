import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./retrive.css";
import { useState } from "react";
import { Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import serverUrl from "../GlobalVariable/serverUrl.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import { useAuth } from "../GlobalFunctions/Auth";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import Collapse from "@mui/material/Collapse";

import BLogo from "../logos/logo_yellow.png";

function RetrivePage() {
  const Auth = useAuth();
  const RetriveAuth = useRetriveAuth();

  const [retriveItems, setRetriveItems] = useState({
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
    PacketType: "retropenloc",
    MobileNo: "",
    passcode: "",
    lat: Auth.currentPosition.lat,
    long: Auth.currentPosition.long,
  });

  const [invalidNumber, setInvalidNumber] = useState(false);
  const [invalidPasscode, setInvalidPasscode] = useState(false)
  const [isWarning, setIsWarning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const verifyPasscodeUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PasscodeHandler";
  // const redirectPath = location.pathname?.path || '/retriveLock'

  const eventHandler = (e) => {
    if (e.target.name === "MobileNo") {
      if (e.target.value.length <= 10) {
        setRetriveItems({
          ...retriveItems,
          MobileNo: e.target.value,
        });
      }
    } else if (e.target.name === "passcode") {
      if (e.target.value.length > 4) {
        const passVal = e.target.value.slice(1, 6);
        setRetriveItems({
          ...retriveItems,
          passcode: passVal,
        });
      } else {
        setRetriveItems({
          ...retriveItems,
          passcode: e.target.value,
        });
      }
    }
  };

  const verifyPasscode = () => {
    if (retriveItems.passcode.length < 4) {
      setIsWarning(true)
    } else if (retriveItems.MobileNo.length < 10) {
      setIsWarning(true)
    } else {
      setIsActive(true);
      RetriveAuth.retriveMobileNoHandler(retriveItems.MobileNo);
      console.log(retriveItems)
      fetch(/* verifyPasscodeUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(retriveItems),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "RESUC-200") {
           
            const retriveItmes = {
              LOCKNO: data.LOCKNO,
            };
            RetriveAuth.setRetriveDet(retriveItmes);
            // RetriveAuth.retriveLockHandler(data.LOCKNO);
            navigate("/retrieveLock", { replace: true });
          } else if (data.responseCode === "INMNO-201") {
            setInvalidNumber(true)
          
          } else if (data.responseCode === "INPAC-201") {
            setInvalidPasscode(true)
            
          }
          setIsActive(false);
        })
        .catch((err) => {
          setIsActive(true);
          console.log("err : " + err);
        });
    }
  };

  const closeWarningAlert = () => {
    setIsWarning(false);
  };

  const closeInvalidNumber = () => {
    setInvalidNumber(false)
  }

  const closeInvalidPasscode = () => {
    setInvalidPasscode(false)
  }
  return (
    <>
      <div className="retrive-page-container">
        <div className="passcode-wind">
          <img className="logo-container" src={BLogo} alt="img" width={100} />
          <Collapse in={isWarning}>
            <Alert
              variant="standard"
              severity="warning"
              onClose={() => closeWarningAlert()}
            >
              Please Provide The Valid Details !
            </Alert>
          </Collapse>

          <Collapse
          in={invalidNumber}>
          <Alert
            variant="standard"
            severity="error"
            onClose={() => closeInvalidNumber()}
          >
            Invalid Mobile Number !
          </Alert>
          </Collapse>


          <Collapse
          in={invalidPasscode}>
          <Alert
            variant="standard"
            severity="error"
            onClose={() => closeInvalidPasscode()}
          >
            Invalid Mobile Number !
          </Alert>
          </Collapse>

          <Box
            component="form"
            // sx={{
            //   "& .MuiTextField-root": { m: 1 },
            // }}
            noValidate
            autoComplete="off"
          >
            <div className="passcode-window" id="passcode-wind-id">
              <div className="passcode-header">
                <h2>Enter Details To Retrieve Your items</h2>
              </div>
              <div className="form-container">
                <TextField
                  type="number"
                  label="mobile number"
                  maxLength={10}
                  name="MobileNo"
                  variant="outlined"
                  color="primary"
                  value={retriveItems.MobileNo}
                  onChange={(e) => eventHandler(e)}
                  required
                  focused
                  fullWidth
                />
              </div>
              <div className="form-container">
                <TextField
                  type="number"
                  label="passcode"
                  maxLength={4}
                  name="passcode"
                  variant="outlined"
                  color="primary"
                  value={retriveItems.passcode}
                  onChange={(e) => eventHandler(e)}
                  required
                  fullWidth
                  focused
                />
              </div>
              {isActive ? (
                <div className="btn-container">
                  <LoadingButton
                    loading
                    loadingPosition="end"
                    endIcon={<SaveIcon />}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    generating
                  </LoadingButton>
                </div>
              ) : (
                <div className="form-container">
                  <Button
                    variant="contained"
                    className="mui-btn-color-yellow"
                    endIcon={<ThumbUpIcon />}
                    onClick={() => verifyPasscode()}
                    fullWidth
                  >
                    confirm
                  </Button>
                </div>
              )}

              <div>
                <Link to="/forgotPass">
                  <a className="forgot-passcode" href="#">
                    forgot passcode?
                  </a>
                </Link>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default RetrivePage;
