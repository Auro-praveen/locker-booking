import React, { useEffect, useState } from "react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../GlobalFunctions/Auth";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { Button } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { styled } from "@mui/material/styles";

import YLogo from "../logos/tuckit_transparent.png";
import { UseLanguage, useLanguage } from "../GlobalFunctions/LanguageFun";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";

function StoreOrRetrive() {
  const [chooseLanguage, setChooseLanguage] = useState("English");
  const [currentPosition, SetCurrentPosition] = useState({
    // lat: "12.9559856",
    // long: "77.5963159",
    lat: "",
    long: ""
  });



  const [terminalIdWind, setTerminalIdWind] = useState(false);
  const [locationAlertWindow, setlocationAlertWindow] = useState(false);

  useEffect(() => {
    if (!Auth.userDetails.terminalID) {
      getTerminalIdFromUrl();
    }
    
    // getCurrentLocation();

    // if the location is not taking manually only for testing purpose
    // Auth.geoLocationHandler(currentPosition);
  }, []);

  const navigate = useNavigate();

  const Auth = useAuth();
  const LangAuth = UseLanguage();
  const RetriveAuth = useRetriveAuth();

  const language = LangAuth.userLanguage;

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      if (!position.coords.latitude) {
        alert("grant permission to access your current location");
      } else {
        const locationObj = {
          lat: String(position.coords.latitude),
          long: String(position.coords.longitude),
        };

        SetCurrentPosition({
          ...currentPosition,
          ...locationObj,
        });

        Auth.geoLocationHandler(locationObj);

        
        // for getting the key val from the url
      }
    });
    setlocationAlertWindow(false)
  };

  const getTerminalIdFromUrl = () => {

      var url_string = window.location.href; // www.test.com?filename=test
      var url = new URL(url_string);
      var paramValue = url.searchParams.get("terminalID");
  
      if (paramValue) {
        const terminalIdObj = {
          terminalID: paramValue,
        };
        console.log(terminalIdObj);
        Auth.existingUserHandler(terminalIdObj);
        RetriveAuth.setRetriveDet(terminalIdObj);
        setTerminalIdWind(false);
        setlocationAlertWindow(true)
      } else {
        setTerminalIdWind(true);
      }
    
  };

  // const changeLanguageFun = () => {
  //   setLanguage(KannadaLang);
  // };

  const chooseLanguageFun = (e) => {
    setChooseLanguage(e.target.value);
    LangAuth.changeUserLanguageFun(e.target.value);
  };

  // const closeDailogueWindow = () => {
  //   setlocationAlertWindow(false)
  // };

  return (
    <>
      <Dialog
        open={locationAlertWindow}
        // onClose={() => closeDailogueWindow()}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Current Location Required !"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Allow your browser to access your current location to proceed !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="info"
            variant="outlined"
            onClick={() => getCurrentLocation()}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {terminalIdWind ? (
        <div className="no-terminal-id-wind">
          <div className="no-terminal-id-content">
            <h3>
              please scan the qr code to
              proceed
            </h3>
          </div>
        </div>
      ) : Auth.currentPosition.lat && Auth.currentPosition.long ? (
        <div className="opening-page-container">
          {/* <div className="choose-lang-container">
            <Box sx={{ minWidth: 120 }}>
              <FormControl
                focused
                size="small"
                style={{
                  width: 150,
                  backgroundColor: "#F17829",
                }}
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={chooseLanguage}
                  // label="Change Language Here"
                  onChange={(e) => chooseLanguageFun(e)}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Kannada">Kannada</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div> */}
          <div className="welcome-page-container">
            <div className="welcomepage-logo-container">
              <img
                className="welcome-page-logo"
                src={YLogo}
                alt="img"
                width={160}
              />
            </div>
            <div className="retrive-or-store">
              {/* <div className="retrive-or-store"> */}
              {/* <hr className="devider"></hr> */}
              {/* <h2 className="page-header">Hello !</h2> */}
              {/* <h4 className="page-header">{language.OpeningPage.hello}</h4> */}
              <h4 className="page-header">
                {" "}
                <strong className="welcome-hello">Hello, </strong>
                Welcome To Tuckit.in
              </h4>
              <div className="choose-retrive">
                <h3 className="container-header">
                  <strong>{language.OpeningPage.storeBtn}</strong>
                </h3>
                <Link to="/login">
                  <IconButton
                    aria-label="delete"
                    className="store-btn"
                    size="large"
                    color="primary"
                  >
                    <KeyboardDoubleArrowUpIcon fontSize="large" />
                  </IconButton>
                </Link>
              </div>

              <div className="diff-line"></div>
              <div className="choose-store">
                <Link to={"/retrieve"}>
                  <IconButton
                    aria-label="delete"
                    className="retrive-btn"
                    size="large"
                    color="primary"
                  >
                    <KeyboardDoubleArrowDownIcon fontSize="large" />
                  </IconButton>
                </Link>
                <h3 className="container-header">
                  <strong> {language.OpeningPage.retrieveBtn}</strong>
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-terminal-id-wind">
          <div className="no-terminal-id-content">
            <h2>Current location is required for security purpose</h2>
            <h6 className="path-to-unblock-loc"> Go to settings {"=>"} site Settings {"=>"} location </h6>
            <h6 className="path-to-unblock-loc"> unblock the site and try again </h6>
            <div className="form-container">
              <Button
                color="primary"
                variant="contained"
                className="mui-btn-color"
                onClick={() => getCurrentLocation()}
                fullWidth
              >
                get Location
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StoreOrRetrive;
