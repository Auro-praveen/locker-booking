import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, Container } from "reactstrap";
import "./userAuthenticate.css";
import { useAuth } from "../../GlobalFunctions/Auth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import YLogo from "../../logos/logo_yellow.png";

function UserAuthenticate(props) {
  const navigate = useNavigate();
  const Auth = useAuth();

  const [userLoginDetails, setUserLoginDetils] = useState({
    MobileNo: Auth.userDetails.MobileNo,
    userName: "",
    dob: "",
  });

  const location = useLocation();

  const redirectPath = location.pathname?.path || "/";
  const evetnChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    setUserLoginDetils({ ...userLoginDetails, [name]: e.target.value });
  };

  const submitFormHandle = (e) => {
    e.preventDefault();
    if (userLoginDetails.userName && userLoginDetails.dob) {
      Auth.existingUserHandler(userLoginDetails);
      navigate(redirectPath, { replace: true });
    } else {
      alert("user name is required");
    }
  };

  return (
    <div className="authenticate-container">
      <div className="authenticate-container-wind">
        {/* <div className="col-md-6 col-lg-6 login-left">
                  <img src={loginBanner} className="img-fluid" alt="Login" />
                </div> */}

        <div className="page-header">
        <img className="logo-container" src={YLogo} alt="img" width={100} />
          <h3 style={{ textAlign: "center" }}>
            <strong>Enter your details Here !!</strong>
          </h3>
        </div>

        <Box
          component="form"
          sx={
            {
              // "& .MuiTextField-root": { m: 2, width: "30ch" },
              // "& .MuiTextField-root": { m: 1},
            }
          }
          noValidate
          autoComplete="off"
        >
          <div className="form-container">
            <TextField
              label="Mobile No"
              color="success"
              variant="outlined"
              value={userLoginDetails.MobileNo}
              InputProps={{
                readOnly: true,
              }}
              focused
              fullWidth
            />
          </div>

          <div className="form-container">
            <TextField
              name="userName"
              label="user name"
              color="primary"
              variant="outlined"
              value={userLoginDetails.userName}
              onChange={(e) => evetnChange(e)}
              required
              fullWidth
              focused
            />
          </div>

          <div className="form-container">
            <TextField
              label="date of birth"
              type="date"
              name="dob"
              color="primary"
              variant="outlined"
              value={userLoginDetails.dataOfBirth}
              onChange={(e) => evetnChange(e)}
              focused
              fullWidth
            />
          </div>

          <div className="form-container">
            <Button
              className="mui-btn-color"
              variant="contained"
              onClick={(e) => submitFormHandle(e)}
              size="large"
              fullWidth
            >
              Proceed
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default UserAuthenticate;
