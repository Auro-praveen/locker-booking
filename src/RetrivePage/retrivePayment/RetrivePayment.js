import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import "./retrivePay.css";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import { useNavigate } from "react-router";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import serverUrl from "../../GlobalVariable/serverUrl.json";

import YLogo from "../../logos/logo_yellow.png";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";

function RetrivePayment() {
  const RetriveAuth = useRetriveAuth();
  const [count, setCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [excessTimeUsage, setExcessTimeUsage] = useState({
    eamount: Math.round(RetriveAuth.excessUsageItems.eamount / 100),
    EXHour: RetriveAuth.excessUsageItems.EXHour,
  });

  const [postPay, setPostPay] = useState({
    amount: Math.round(RetriveAuth.postPayItem.amount / 100),
    Hour: RetriveAuth.postPayItem.Hour,
  });

  const totalAmount =
    Number(Math.round(RetriveAuth.postPayAndExcessUsage.amount / 100)) +
    Number(Math.round(RetriveAuth.postPayAndExcessUsage.eamount / 100));

  const [postPayExcessUsage, setPostPayExcessUsage] = useState({
    amount: Math.round(RetriveAuth.postPayAndExcessUsage.amount / 100),
    Hour: RetriveAuth.postPayAndExcessUsage.Hour,
    eamount: Math.round(RetriveAuth.postPayAndExcessUsage.eamount / 100),
    EXHour: RetriveAuth.postPayAndExcessUsage.EXHour,
    totAmount: totalAmount,
  });

  // transaction id is static here

  const [retrivePaymentItem, setRetrivePaymentItem] = useState({
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
    MobileNo: RetriveAuth.MobileNo,
    LockerNo: RetriveAuth.retrieveLockSelected,
    TransactionID: "66640912221804431"
  });

  const [paymentHandlerWind, setPaymentHandlerWind] = useState(true);

  const navigate = useNavigate();

  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const paymentUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/RetrivePaymentHandler";

  // if different packet types are needed to send money
  // const postPaymentHandler = (amount) => {
  //   const obj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrexcepay",
  //     amount: amount

  //   };
  //   paymentHandler(obj)
  // }

  // const excessPaymentHandler = (amount) => {
  //   const obj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrepopay",
  //     amount: amount

  //   };
  //   paymentHandler(obj)
  // }

  // const postExcessAmountHandler = (amount) => {
  //   const obj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrexcepopay",
  //     amount: amount

  //   };
  //   paymentHandler(obj)
  // }

  const paymentHandler = (totAmount) => {
    setPaymentHandlerWind(false);
    console.log(retrivePaymentItem);
    const obj = {
      ...retrivePaymentItem,
      PacketType: "retrexcepopay",
      amount: totAmount,
    };
    console.log(obj);
    fetch(/* paymentUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "LOCEPORID-200") {
          razorPayPayment(data.orderId, data.totAmount);
          setPaymentHandlerWind(true);
        } else {
          alert("Something went wrong");
          setPaymentHandlerWind(true);
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        setPaymentHandlerWind(true);
      });
  };

  console.log("post amount : " + RetriveAuth.postPayItem.amount);

  const razorPayPayment = (orderId, amount) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    // setCount((count) => count + 1);
    var options = {
      key: "rzp_test_kF1NdHUm47R7R4",
      amount: amount,
      currency: "INR",
      image: "https://example.com/your_logo",
      order_id: orderId,
      name: "Auro Locker",
      description: "secured payment here",
      // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",

      prefill: {
        name: "praveen",
        email: "praveen@gmail.com",
        contact: "9909900990",
      },

      notes: {
        address: "AuroTec office near richmond",
      },

      theme: {
        color: "#0e4a1e",
      },

      handler: function (response) {
        if (
          response.razorpay_payment_id &&
          response.razorpay_order_id &&
          response.razorpay_signature
        ) {
          setIsSuccess(true);
          setIsError(false)
          let timeLeft = 3;
          const timeInterval = setTimeout(() => {
            if (timeLeft === 0) {
              clearInterval(timeInterval);
            }
            timeLeft = timeLeft - 1;
          }, 100);
          const obj = {
            PacketType: "retrexcepopaycnf",
            responseCode: "paymentSuccess",
            OrderId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignatur: response.razorpay_signature,
          };
          paymentStatusHandler(obj);
        } else {
          setCount((count) => count + 1);
          setIsError(true);
          console.log("went wrong")
          if (count === 3) {
            let timeLeft = 3;
            const timeInterval = setTimeout(() => {
              if (timeLeft === 0) {
                clearInterval(timeInterval);
              }
              timeLeft = timeLeft - 1;
            }, 100);

            const obj = {
              PacketType: "retrexcepopaycnf",
              responseCode: "payFailCancel",
              OrderId: orderId,
            };
            paymentStatusHandler(obj);
          } 
        }
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setCount((count) => count + 1);
    // setIsError(true);
    console.log("went wrong")
    if (count >= 2) {
      let timeLeft = 3;
      const timeInterval = setTimeout(() => {
        if (timeLeft === 0) {
          clearInterval(timeInterval);
        }
        timeLeft = timeLeft - 1;
      }, 100);

      const obj = {
        PacketType: "retrexcepopaycnf",
        responseCode: "payFailCancel",
        OrderId: orderId,
      };
      paymentStatusHandler(obj);
    } 
    // paymentObject.createElement()
  };

  const payemtnStatUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PaymentConfirm";
  const paymentStatusHandler = (stat) => {
    const respObj = {
      ...retrivePaymentItem,
      ...stat,
    };

    fetch(/* payemtnStatUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(respObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "LOCRS-200") {
          setIsError(false)
          if (count === 2) {
            setIsSuccess(true)
            let timeLeft = 10;
            const timeInterval = setTimeout(() => {
              if (timeLeft === 0) {
                clearInterval(timeInterval);
              }
              timeLeft = timeLeft - 1;
            }, 100);
          }
          navigate("/verlockopenret", { replace: true });
        } else if (data.responseCode === "LOCRETCA-201") {
          alert("something went wrong")
        }
      });
  };

  // const payLaterFormSubmit = () => {

  //   const retrievePayFailObj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrexcepopaycnf",
  //     responseCode: "payFailCancel",
  //   }
  //   fetch(/* payemtnStatUrl */ serverUrl.path, {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //     },
  //     body: JSON.stringify(retrievePayFailObj),
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.responseCode === "LOCRS-200") {
  //         navigate("/verlockopenret", { replace: true });
  //       }
  //     });
  // }

  // await new Promise(r => setTimeout(r, 2000));
  // await sleep(1000);

  const timeCalculation = (time) => {
    console.log(time);
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const totTime = hour + " hours," + minute + " minutes";
    return totTime;
  };

  const closeErrorAlert = () => {
    setIsError(false);
  };

  const closeSuccessAlert = () => {
    setIsSuccess(false);
  };

  return (
    <div className="retrive-payment-container">
      <div className="retrive-pay-wind">
        <img className="logo-container" src={YLogo} alt="img" width={100} />
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Collapse in={isError}>
            <Alert
              variant="standard"
              severity="error"
              onClose={() => closeErrorAlert()}
            >
              Payment Failed !!
            </Alert>
          </Collapse>

          <Collapse in={isSuccess}>
            <Alert
              variant="standard"
              severity="success"
              onClose={() => closeSuccessAlert()}
            >
              Payment Success !!
            </Alert>
          </Collapse>
        </Stack>
        {count === 3 ? (
          <div className = "retr-pay-fail-wind">
            <h4> We send you the Payment Link to your mobile number</h4>
            <h4> You can Pay it while using lock for the next time !!</h4>
            {/* <Button
              color="primary"
              className="mui-btn-color-yellow"
              variant="contained"
              onClick={() => payLaterFormSubmit()}
            >
              Proceed
            </Button> */}
          </div>
        ) : (
          <Box
            component="form"
            sx={{
              // "& .MuiTextField-root": { m: 1, width: "30ch" },
              "& .MuiTextField-root": { m: 1, height: "6ch" },
            }}
            noValidate
            autoComplete="off"
          >
            {excessTimeUsage.EXHour ? (
              <>
                <h2 className="container-item-header">Excess usage</h2>
                <div className="form-container">
                  <TextField
                    label="excess time"
                    type="text"
                    name="eHour"
                    variant="outlined"
                    color="primary"
                    value={timeCalculation(excessTimeUsage.EXHour)}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    fullWidth
                    required
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="excess amount"
                    type="number"
                    name="eAmount"
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    value={excessTimeUsage.eamount}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    fullWidth
                    required
                  />
                </div>
                {paymentHandlerWind ? (
                  <div className=" form-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mui-btn-color-yellow"
                      onClick={() => paymentHandler(excessTimeUsage.eamount)}
                      fullWidth
                    >
                      {" "}
                      proceed to pay{" "}
                    </Button>
                  </div>
                ) : (
                  <div className=" form-container">
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      loading
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : postPay.Hour ? (
              <>
                <h2 className="container-item-header">post payment</h2>
                <div className=" form-container">
                  <TextField
                    label="tot Hour"
                    type="text"
                    name="hour"
                    variant="outlined"
                    value={timeCalculation(postPay.Hour)}
                    color="primary"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="Amount"
                    type="number"
                    name="amount"
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    value={postPay.amount}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>
                {paymentHandlerWind ? (
                  <div className="form-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mui-btn-color-yellow"
                      onClick={() => paymentHandler(postPay.amount)}
                      fullWidth
                    >
                      {" "}
                      proceed to pay{" "}
                    </Button>
                  </div>
                ) : (
                  <div className="form-container">
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      loading
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : postPayExcessUsage.EXHour ? (
              <>
                <h2 className="container-item-header">
                  post payment and Excess usage
                </h2>
                <div className="form-container">
                  <TextField
                    label="Hour"
                    type="text"
                    name="hour"
                    variant="outlined"
                    color="primary"
                    value={timeCalculation(postPayExcessUsage.Hour)}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="Amount"
                    type="number"
                    name="amount"
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    value={postPayExcessUsage.amount}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>
                <div className="form-container">
                  <TextField
                    label="Excess Time"
                    type="text"
                    name="eHour"
                    variant="outlined"
                    
                    color="primary"
                    value={timeCalculation(postPayExcessUsage.EXHour)}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="Excess Amount"
                    type="number"
                    name="eAmount"
                    variant="outlined"
                    helperText="including GST"
                    color="primary"
                    value={postPayExcessUsage.eamount}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>
                <div className="form-container">
                  <TextField
                    label="total Amount"
                    type="number"
                    name="totAmount"
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    value={postPayExcessUsage.totAmount}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    focused
                    required
                  />
                </div>

                {paymentHandlerWind ? (
                  <div className="form-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mui-btn-color-yellow"
                      onClick={() =>
                        paymentHandler(postPayExcessUsage.totAmount)
                      }
                      fullWidth
                    >
                      {" "}
                      proceed to pay{" "}
                    </Button>
                  </div>
                ) : (
                  <div className="btn-container">
                    <LoadingButton
                      loading
                      loadingPosition="end"
                      endIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      loading ...
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : null}
          </Box>
        )}
      </div>
    </div>
  );
}

export default RetrivePayment;
