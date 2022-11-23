import React, { useState } from "react";
import "./submitLocks.css";
import { Grid } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import { useAuth } from "../GlobalFunctions/Auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import ErrorIcon from "../utils/error.png";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import serverUrl from "../GlobalVariable/serverUrl.json";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";

import YLogo from "../logos/logo_yellow.png";
import CloseIcon from "@mui/icons-material/Close";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { Stack } from "@mui/material";
import { Alert } from "@mui/material";
import { Collapse } from "@mui/material";

function SubmitLock(props) {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [userSelectedLock, setUserSelectedLock] = useState({
    TransactionId: Auth.userDetails.TransactionId,
    MobileNo: Auth.userDetails.MobileNo,
    terminalID: Auth.userDetails.terminalID,
    dob: Auth.userDetails.dob,
    cname: Auth.userDetails.userName,
  });

  const [orderId, setOrderId] = useState("");
  const [submitBtnStatus, setSubmitBtnStatus] = useState(false);
  const [errorWindowStat, setErrorWindowStat] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const testKey = "rzp_test_kF1NdHUm47R7R4";
  const liveKey = "rzp_live_sjKUSO8AovpnnS";

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const pageStates = props.verifyDocStatus;

  let noOfHours = Math.floor(props.noOfHours / 60);
  let andMinutes = props.noOfHours % 60;
  if (andMinutes === 60) {
    noOfHours = noOfHours + 1;
    andMinutes = andMinutes * 0;
  }

  const confirmBookForm = (e) => {
    let passcode;
    if (props.passcode.length === 0) {
      passcode = Auth.passcode;
    } else {
      passcode = props.passcode;
    }

    e.preventDefault();
    const confirmLockObj = {
      ...userSelectedLock,
      passcode: passcode,
      LockerNo: props.userSelected,
      PacketType: "stlockcnf",
      hours: props.noOfHours,
      amount: props.pricePerHour,
      DevTime: getCurrentTime(),
    };

    setUserSelectedLock({
      ...userSelectedLock,
      ...confirmLockObj,
    });

    console.log(confirmLockObj);
    fetchFinalDataBeforePayment(confirmLockObj);
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";
  const fetchBeforPaymentUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PaymentStatusBefor";

  const fetchFinalDataBeforePayment = (statusBefore) => {
    console.log(statusBefore);
    setSubmitBtnStatus(true);
    fetch(/*fetchBeforPaymentUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(statusBefore),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "LOCKAVS-200") {
          if (data.orderId !== "none") {
            setOrderId(data.orderId);
            razorPayPayment(data.orderId, data.totAmount, statusBefore);
          } else {
            alert("something went wrong");
            setSubmitBtnStatus(false);
          }
        } else if (data.responseCode === "LOCKAVF-201") {
          setErrorWindowStat(true);
          setSubmitBtnStatus(false);
          Auth.busyLockerFunction(statusBefore.LockerNo);
          setSubmitBtnStatus(true);
        } else {
          alert("something went wrong");
          setSubmitBtnStatus(false);
        }
      })
      .catch((err) => {
        console.log("err :" + err);
        setSubmitBtnStatus(false);
      });
  };

  // const url = "https://api.razorpay.com/v1/orders ";

  const razorPayPayment = (orderId, amount, status) => {
    // setCount((count) => count + 1);
    console.log("status carying");
    console.log(status);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    console.log("inside function ");
    var options = {
      key: testKey,
      amount: amount,
      currency: "INR",
      image: "https://example.com/your_logo",
      order_id: orderId,
      name: "Auro Locker",
      description: "secured payment here",
      // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",

      prefill: {
        name: userSelectedLock.userName,
        email: "praveen@gmail.com",
        contact: userSelectedLock.MobileNo,
      },
      notes: {
        address: "AuroTec office near richmond",
      },
      theme: {
        color: "#0e4a1e",
      },
      handler: function (response) {
        console.log("inside response function"+ response)
        if (
          response.razorpay_payment_id &&
          response.razorpay_order_id &&
          response.razorpay_signature
        ) {
          setIsSuccess(true);
          setIsError(false);

          let timeLeft = 10;
          const interval = setInterval(() => {
            if (timeLeft === 0) {
              clearInterval(interval);
            }
            timeLeft = timeLeft - 1;
            console.log(timeLeft);
          }, 1000);
          
          const paymentSuccess = {
            ...status,
            PacketType: "stopenloc",
            responseCode: "paymentSuccess",
            orderId: orderId,
            razorpayId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };
          ConfirmPaymentDetails(paymentSuccess);
        } else {
          setIsSuccess(false);
          setIsError(true);
          setCount((count) => count + 1);
          let timeLeft = 11;
          const interval = setInterval(() => {
            if (timeLeft === 0) {
              clearInterval(interval);
            }
            timeLeft = timeLeft - 1;
            console.log(timeLeft);
          }, 1000);

            const paymentSuccess = {
            ...status,
            PacketType: "stopenloc",
            responseCode: "payFailCancel",
            orderId: orderId,
          };
          ConfirmPaymentDetails(paymentSuccess);
          setSubmitBtnStatus(false);
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    // paymentObject.createElement()
    console.log("outside response function")
    setIsSuccess(false);
    setIsError(true);
    setCount((count) => count + 1);
    let timeLeft = 5;
    const interval = setInterval(() => {
      if (timeLeft === 0) {
        clearInterval(interval);
      }
      timeLeft = timeLeft - 1;
      console.log(timeLeft);
    }, 1000);

    if (count === 2) {
      const paymentSuccess = {
        ...status,
        PacketType: "stopenloc",
        responseCode: "payFailCancel",
        orderId: orderId,
      };
      ConfirmPaymentDetails(paymentSuccess);
    }
    setSubmitBtnStatus(false);
  };

  const confirmSeatUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PaymentStatusHandler";
  const ConfirmPaymentDetails = (status) => {
    fetch(/*confirmSeatUrl*/ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-type":"application/json"
      },
      body: JSON.stringify(status),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "LOCKOPEN-200") {
          Auth.userSelectedLockHandler(props.userSelected);
          setSubmitBtnStatus(false);
          Auth.seatCountFun(1);
          if (Auth.passcode.length < 1) {
            Auth.passcodeHandler(props.passcode);
          }
          Auth.busyLockerFunction(props.userSelected);
          navigate("/verOpenLock", { replace: true });
          // navigate("/success", { replace: true });
        } else if ("LOCKOPENCA-201") {
          alert("failed to open payment failed");
        } else {
          alert("failed");
        }
        setSubmitBtnStatus(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setSubmitBtnStatus(false);
      });
  };

  const chooseLocksAgainFun = (e) => {
    setSubmitBtnStatus(false);
    setErrorWindowStat(false);
    Auth.busyLockerFunction(props.userSelected);
    props.choosingLocksStatus(props.userSelected);
  };

  const payLaterSubmission = () => {
    const payLater = {
      ...userSelectedLock,
      PacketType: "stopenloc",
      responseCode: "payFailPaylater",
      orderId: orderId,
    };

    console.log(payLater);
    fetch(/*confirmSeatUrl*/ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-type":"application/json"
      },
      body: JSON.stringify(payLater),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "LOCKOPEN-200") {
          Auth.userSelectedLockHandler(props.userSelected);
          // setSubmitBtnStatus(false);
          Auth.seatCountFun(1);
          if (Auth.passcode.length < 1) {
            Auth.passcodeHandler(props.passcode);
          }
          Auth.busyLockerFunction(props.userSelected);
          navigate("/verOpenLock", { replace: true });
          // navigate("/success", { replace: true });
        } else if (data.responseCode === "LOCKOPENCA-201") {
          alert("payment failed");
        } else if (data.responseCode === "LOCKOPENPL-200") {
          navigate("/postpay", { replace: true });
        } else {
          alert("failed");
        }
        setSubmitBtnStatus(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setSubmitBtnStatus(false);
      });
  };

  const logoutHandler = () => {
    setOpen(true);
    Auth.logoutHandler();
  };

  const closeErrorAlert = () => {
    setIsError(false);
  };

  const closeSuccessAlert = () => {
    setIsSuccess(false);
  };

  return (
    <>
      <Grid
      // container
      // className="row h-100 justify-content-center align-items-center "
      >
        <Grid>
          <Col>
            <div
              className={
                pageStates ? "verify-container" : "verify-container-hidden"
              }
            >
              <div className="paymentgateway-container">
                <div className="backbtn-container">
                  <IconButton
                    className="back-btn"
                    color="secondary"
                    onClick={props.backToPasscode}
                  >
                    <ArrowBackIosIcon fontSize="medium" />
                  </IconButton>
                </div>

                <div className="close-container">
                  <IconButton
                    className="close-btn"
                    color="secondary"
                    onClick={handleClickOpen}
                  >
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                  <br />
                </div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Are You Sure You Want To Leave?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are You sure you want to close this application?, All the
                      Details You entered will be lossed
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleClose}
                    >
                      No
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => Auth.logoutHandler()}
                      autoFocus
                    >
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>

                <br />
                <img
                  className="logo-container"
                  src={YLogo}
                  alt="img"
                  width={100}
                />
                <Stack>
                  <Collapse in={isError}>
                    <Alert
                      variant="standard"
                      severity="error"
                      onClose={() => closeErrorAlert()}
                    >
                      Something is wrong
                    </Alert>
                  </Collapse>

                  <Collapse in={isSuccess}>
                    <Alert
                      variant="standard"
                      severity="success"
                      onClose={() => closeSuccessAlert()}
                    >
                      payment was successfull
                    </Alert>
                  </Collapse>
                </Stack>
                <h3>Verify the Details</h3>
                <Box
                  component="form"
                  sx={{
                    // "& .MuiTextField-root": { m: 2, width: "40ch" },
                    "& .MuiTextField-root": { m: 1, width: 280},
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    label="terminal ID "
                    value={userSelectedLock.terminalID}
                    variant="outlined"
                    color="primary"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                  />

                  <TextField
                    label="user name"
                    value={userSelectedLock.cname}
                    variant="outlined"
                    color="primary"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                  />

                  <TextField
                    label="mobile no"
                    value={userSelectedLock.MobileNo}
                    variant="outlined"
                    color="primary"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                  />

                  <TextField
                    label="locker selected"
                    value={props.userSelected}
                    variant="outlined"
                    color="primary"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                  />

                  <TextField
                    label="total time"
                    variant="outlined"
                    color="primary"
                    value={noOfHours + " hour " + andMinutes + " minutes"}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                  />

                  <TextField
                    className="Mui-focused"
                    label="total amount"
                    value={props.pricePerHour + ".00 Rs"}
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                  />

                  {submitBtnStatus ? (
                    <div className="btn-container">
                      <LoadingButton
                        loading
                        loadingPosition="end"
                        endIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                      >
                        proceed to pay
                      </LoadingButton>
                    </div>
                  ) : (
                    <div className="btn-container">
                      <Button
                        type="button"
                        variant="contained"
                        className="mui-btn-color"
                        onClick={(e) => confirmBookForm(e)}
                        endIcon={<PaymentIcon />}
                        fullWidth
                      >
                        proceed to pay
                      </Button>
                    </div>
                  )}
                </Box>

                {submitBtnStatus === false && (
                  <div className="backto-choose-locks">
                    <p className="">
                      back to{" "}
                      <Button
                        className="chooseLock-link"
                        variant="text"
                        color="primary"
                        onClick={() => props.choosingLocksStatus()}
                      >
                        {" "}
                        Choose locker..
                      </Button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Grid>
      </Grid>

      {errorWindowStat && (
        <>
          <div className="lockerUnavailable-window"></div>
          <div className="locker-un-wind">
            <img className="error-img-icon" src={ErrorIcon} alt="err-icon" />
            <h2 className="small-window-head">
              {" "}
              locker you choose just occupied{" "}
            </h2>
            <h6 className="small-window-desc"> please choose another locker </h6>
            <div className="buttons-container">
              <Button
                variant="contained"
                color="secondary"
                className="mui-btn-color"
                onClick={() => chooseLocksAgainFun()}
                startIcon={<SwapHorizontalCircleIcon />}
              >
                Back To Locker..
              </Button>
            </div>
          </div>
        </>
      )}

      {count === 3 && (
        <>
          <div className="lockerUnavailable-window"></div>
          <div className="payLater-wind">
            <h2 className="item-header">Payment failed</h2>
            <h5 className="item-header">
              Do you want to store now and pay later
            </h5>

            <Button
              variant="contained"
              color="primary"
              className="btn-group"
              onClick={() => payLaterSubmission()}
            >
              store now
            </Button>

            <Button
              variant="contained"
              color="primary"
              className="btn-group"
              onClick={() => logoutHandler()}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default SubmitLock;
