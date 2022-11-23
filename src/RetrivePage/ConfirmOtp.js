import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbsDownIcon from "@mui/icons-material/ThumbDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import serverUrl from "../GlobalVariable/serverUrl.json";
import "./retrive.css";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

function ConfirmOtp() {
  const [enteredOtp, setEnteredOtp] = useState();
  const [timeOut, setTimeOut] = useState(60);

  const RetriveAuth = useRetriveAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  var time = 60;

  // var interval;
  const interval = useRef();
  useEffect(() => {
    // window.location.reload(false);
    clearInterval(interval.current);
    countDowninterval();
  }, []);

  const countDowninterval = () => {
    interval.current = setInterval(() => {
      // console.log(time)
      if (time < 0) {
        clearInterval(interval.current);
        setTimeOut(0);
      } else {
        setTimeOut(time);
      }
      time = time - 1;
      console.log(time)
    }, 1000);
  };

  const otpHandlerEvent = (e) => {
    if (e.target.value.length > 4) {
    } else {
      setEnteredOtp(e.target.value);
    }
  };

  const resendOtpFun = () => {
    clearInterval(interval.current);
    setEnteredOtp("");
  };

  const redirectPath = location.pathname?.path || "/retrieveLock";

  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const verifyPasscodeUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PasscodeHandler";

  const verifyOtpFunction = () => {
    alert("inside");

    if (enteredOtp.length < 4) {
      alert("check your passcode again");
    } else {
      setIsLoading(true);
      clearInterval(interval.current);
      const obj = {
        terminalID:RetriveAuth.retriveLockContainer.terminalID,
        // terminalID: "G21",
        MobileNo: RetriveAuth.MobileNo,
        otp: enteredOtp,
        PacketType: "retropenlocotpconf",
      };
      console.log(obj);
      fetch(/* verifyPasscodeUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "RESUC-200") {
            setIsLoading(false);
            const locks = {
              LOCKNO: data.LOCKNO,
              // terminalID: data.terminalID,
            };
            RetriveAuth.setRetriveDet(locks);
            navigate(redirectPath, { replace: true });
          } else if (data.responseCode === "INPAC-201") {
            setIsLoading(false);
            alert("invalid passcode");
          } else if (data.responseCode === "INMNO-201") {
            setIsLoading(false);
            alert("invalid phone number");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err : " + err);
        });
    }
  };

  return (
    <>
      <div className="verify-otp-container">
        <div className="verify-otp-wind">
          <h3>verify otp here</h3>
          <Box
            component="form"
            sx={{
              // "& .MuiTextField-root": { m: 1, width: "30ch" },
              "& .MuiTextField-root": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <h2 className="timout">{timeOut}</h2>
            <div className="form-container">
              <TextField
                label="otp"
                type="number"
                name="otp"
                variant="outlined"
                color="primary"
                focused
                required
                fullWidth
                value={enteredOtp}
                onChange={(e) => otpHandlerEvent(e)}
              />
            </div>
            <div className="form-container">
              <Link to="/forgotPass">
                <Button
                  variant="text"
                  color="primary"
                  onClick={(e) => resendOtpFun(e)}
                  fullWidth
                >
                  {" "}
                  resend otp?{" "}
                </Button>
              </Link>
            </div>
            <div className="form-container">
              {timeOut !== 0 ? (
                isLoading ? (
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
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    className="mui-btn-color-yellow"
                    endIcon={<ThumbUpIcon />}
                    onClick={(e) => verifyOtpFunction(e)}
                    fullWidth
                  >
                    Verify OTP &nbsp;&nbsp;&nbsp;
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  endIcon={<ThumbsDownIcon />}
                  fullWidth
                  disabled
                >
                  time up &nbsp;&nbsp;&nbsp;
                </Button>
              )}
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default ConfirmOtp;
