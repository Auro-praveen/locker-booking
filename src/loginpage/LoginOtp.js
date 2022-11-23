import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../GlobalFunctions/Auth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import serverUrl from "../GlobalVariable/serverUrl.json";
import ThumbsDownIcon from "@mui/icons-material/ThumbDown";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import YLogo from '../logos/logo_yellow.png'

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";

function LoginOtp() {
  const Auth = useAuth();

  const [enteredOtp, setEnteredOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // time counter
  const [isLoading, setIsLoading] = useState(false);
  const [clientRequest, setClientRequest] = useState({
    terminalID: Auth.userDetails.terminalID,
    // currentTime: "",
    MobileNo: Auth.phoneNumber,
  });

  const [activeError, setActiveError] = useState(false);
  const [activeSuccess, setActiveSuccess] = useState(false);
  const [activeInfo, setActiveInfo] = useState(false);

  useEffect(() => {
    countDownTime();
  }, []);

  const navigate = useNavigate()
  const location = useLocation();
  const redirectPath = location.pathname?.path || "/";

  const getCurrentTimeFun = () => {
    const date = new Date();
    console.log(
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    );
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  const alertInterval = useRef();
  var alertTime = 3;

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  const verifyOtpUrl = "http://192.168.0.198:8080/AuroAutoLocker/ConfirmOtp";
  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  // time limit for otp
  var time = 60;
  // var interval;
  const interval = useRef();
  // for the countDown of Time to get otp
  const countDownTime = () => {
    interval.current = setInterval(() => {
      time = time - 1;
      // console.log(time);
      if (time < 0) {
        // setTime(30)
        clearIntervalFun();
      } else {
        setTimeLeft(time);
      }
    }, 1000);
  };

  const clearIntervalFun = () => {
    clearInterval(interval.current);
    setTimeLeft(0);
  };

  const verifyOtpFunction = (e) => {
    e.preventDefault();
    const afterEnteredOtpData = {
      ...clientRequest,
      otp: enteredOtp,
      PacketType: "stverotp",
      time: getCurrentTimeFun(),
    };

    // console.log(afterEnteredOtpData)

    if (enteredOtp.length === 4) {
      setIsLoading(true);
      fetch(/* verifyOtpUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(afterEnteredOtpData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("from databases : ")
          console.log(data);
          if (data.responseCode === "VEROTPN-200") {
            setActiveSuccess(true);
            respnseHandlerFun(data);
            navigate("/userAuth", { replace: true });
          } else if (data.responseCode === "VEROTPE-200") {
            respnseHandlerFun(data);
            clearIntervalFun();
            navigate(redirectPath, { replace: true });
          } else if (data.responseCode === "VEROTPW-203") {
            setActiveError(true);
            // clearIntervalFun();
          } else {
            setActiveError(true);
            // clearIntervalFun();
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err " + err);
        });
    } else {
      setActiveInfo(true);
    }
  };

  const respnseHandlerFun = (data) => {
    Auth.loginHandler(clientRequest.MobileNo);

    let smallLockAmnt;
    let mediumLockAmnt;
    let largeLockAmnt;
    let extraLargeAmnt;

    if (data.Small) {
      smallLockAmnt = data.Small;
    } else {
      smallLockAmnt = [0, 0, 0];
    }

    if (data.Medium) {
      mediumLockAmnt = data.Medium;
    } else {
      mediumLockAmnt = [0, 0, 0];
    }

    if (data.Large) {
      largeLockAmnt = data.Large;
    } else {
      largeLockAmnt = [0, 0, 0];
    }

    if (data.eLarge) {
      extraLargeAmnt = data.eLarge;
    } else {
      extraLargeAmnt = [0, 0, 0];
    }

    const existingUSerDetails = {
      MobileNo: clientRequest.MobileNo,
      TransactionId: data.TransactionId,
      userName: data.cname,
      AvailableLocker: data.AvailableLocker,
      dob: data.dob,
      hours: data.hourslot,
      smallLockPriceMinute: smallLockAmnt[0],
      mediumLockPriceMinute: mediumLockAmnt[0],
      largeLockPriceMinute: largeLockAmnt[0],
      extraLargePriceMinute: extraLargeAmnt[0],
      smallLockPriceHours: smallLockAmnt.slice(1), //first element in the array is for minute so assigning that to minute side we slice here that amount and take remaining
      largeLockPriceHours: largeLockAmnt.slice(1),
      mediumLockPriceHours: mediumLockAmnt.slice(1),
      extraLargePriceHours: extraLargeAmnt.slice(1),
    };
    Auth.existingUserHandler(existingUSerDetails);
  };

  const resendOtpFun = (e) => {
    setTimeLeft(60);
    e.preventDefault();
    setEnteredOtp("");
    navigate("/login");
    clearIntervalFun();
  };

  const otpHandlerEvent = (e) => {
    if (e.target.value.length < 5) {
      setEnteredOtp(e.target.value);
    }
  };

  // const hideAlertWindow = (value) => {
  //   alertInterval.current = setInterval(() => {
  //     alertTime = alertTime - 1;
  //     console.log(value+"  "+alertTime)
  //     if (alertTime < 0) {
  //       if (value === "error") {
  //         setActiveError(false);

  //       } else if (value === "success") {
  //         setActiveSuccess(false);

  //       } else if (value === "info") {
  //         setActiveInfo(false);

  //       } else {
  //         setActiveError(false);
  //         setActiveSuccess(false);

  //       }
  //       clearAlertIntervalFun();
  //     }
  //   }, 1000);
  // };

  // const clearAlertIntervalFun = () => {
  //   clearInterval(alertInterval.current);
  // }

  // if (activeError) {
  //   hideAlertWindow("error");
  // } else if (activeSuccess) {
  //   hideAlertWindow("success");
  // } else if (activeInfo) {
  //   hideAlertWindow("info");
  // }

  const hideErrorAlert = () => {
    setActiveError(false);
    // hideAlertWindow("error");
  };
  const hideSuccessAlert = () => {
    setActiveSuccess(false);
    // hideAlertWindow("success");
  };

  const hideInfoAlert = () => {
    setActiveInfo(false);
    // hideAlertWindow("info");
  };

  return (
    <div className="otp-page-container">
      <div className="otp-form-container">
      <img className="logo-container" src={YLogo} alt="logo" width={100} />
        <Stack sx={{ width: "100%" }} spacing={2}>
          {activeError && (
            <Alert
              variant="filled"
              severity="error"
              onClose={() => hideErrorAlert()}
            >
              OTP did not match
            </Alert>
          )}

          {activeSuccess && (
            <Alert
              variant="filled"
              severity="success"
              onClose={() => hideSuccessAlert()}
            >
              otp verified
            </Alert>
          )}

          {activeInfo && (
            <Alert
              variant="filled"
              severity="info"
              onClose={() => hideInfoAlert()}
            >
              Please Enter Valid OTP
            </Alert>
          )}
        </Stack>
        <Box
          component="form"
          // sx={{
          //   // "& .MuiTextField-root": { m: 1, width: "30ch" },
          //   "& .MuiTextField-root": { m: 1 },
          // }}
          noValidate
          autoComplete="off"
        >
          <div className=" form-container">
            <div>
              <h5 className="otp-header">{language.LoginOTP.otpTitle}</h5>
              <div
                className={
                  timeLeft > 0
                    ? "time-countdown-container"
                    : "time-countdown-container-timeout"
                }
              >
                <h1 className="otp-countdown">{timeLeft}</h1>{" "}
              </div>
            </div>
            <div className="form-container">
              <TextField
                label={language.LoginOTP.otpTxt}
                type="number"
                name="otp"
                variant="outlined"
                color="primary"
                value={enteredOtp}
                onChange={(e) => otpHandlerEvent(e)}
                fullWidth
                focused
              />
            </div>
            <div>
              <Button
                variant="text"
                color="info"
                onClick={(e) => resendOtpFun(e)}
              >
                {" "}
                {language.LoginOTP.resendOTP}{" "}
              </Button>
            </div>
            <div className="form-container">
              {timeLeft > 0 ? (
                isLoading ? (
                  <div className="btn-container">
                    <LoadingButton
                      loading
                      loadingPosition="end"
                      endIcon={<SaveIcon />}
                      variant="contained"
                      fullWidth
                    >
                      verifying otp..
                    </LoadingButton>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    className="mui-btn-color"
                    type="button"
                    endIcon={<ThumbUpAltIcon />}
                    onClick={(e) => verifyOtpFunction(e)}
                    size="large"
                    fullWidth
                  >
                    {language.LoginOTP.otpConfirmBtn} &nbsp;&nbsp;&nbsp;
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  endIcon={<ThumbsDownIcon />}
                  disabled
                  fullWidth
                >
                  time up &nbsp;&nbsp;&nbsp;
                </Button>
              )}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default LoginOtp;
