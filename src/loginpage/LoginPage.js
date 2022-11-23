import React, { useState, useEffect, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

import "./LoginDes.css";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../GlobalFunctions/Auth";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import serverUrl from "../GlobalVariable/serverUrl.json";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import YLogo from "../logos/logo_yellow.png";

import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { UseLanguage, useLanguage } from "../GlobalFunctions/LanguageFun";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function LoginPage(props) {
  const Auth = useAuth();

  const [clientRequest, setClientRequest] = useState({
    terminalID: Auth.userDetails.terminalID,
    currentTime: "",
    MobileNo: "",
  });

  const [activeWarning, setActiveWarning] = useState(false);
  const [activeError, setActiveError] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const [btnActive, setBtnActive] = useState(true);
  const [limitExceed, setLimitExceed] = useState(false);

  const [storeWindClass, setStoreWindClass] = useState("store-page-container");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCurrentTimeFun = () => {
    const date = new Date();
    console.log(
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    );
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  useEffect(() => {
    if (Auth.currentPosition.lat === "" && Auth.currentPosition.long === "") {
      alert("false");
      navigate("/", { replace: true });
      // navigate("/", { replace: true });
    }

    if (Auth.phoneNumber) {
      setClientRequest({
        ...clientRequest,
        MobileNo: Auth.phoneNumber,
      });
    }
  }, []);

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  const sendOtpUrl = "http://192.168.0.198:8080/AuroAutoLocker/OtpHandler";
  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const sendOtpFun = (e) => {
    e.preventDefault();
    setBtnActive(false);
    if (clientRequest.MobileNo === undefined) {
      alert("please enter the phone number");
    } else if (clientRequest.MobileNo.length === 10) {
      if (isChecked) {
        Auth.loginHandler(clientRequest.MobileNo);
        const time = getCurrentTimeFun();
        setClientRequest({
          ...clientRequest,
          ...Auth.currentPosition,
          currentTime: time,
        });

        const custDetials = {
          ...clientRequest,
          ...Auth.currentPosition,
          PacketType: "stgetotp",
          currentTime: time,
        };
        console.log(custDetials);

        fetch(/*sendOtpUrl*/ serverUrl.path, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: JSON.stringify(custDetials),
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
            if (
              data.responseCode === "GENOTP-200" ||
              data.responseCode === "GENOTP-201"
            ) {
              const lockCount = parseInt(data.Lcount);
              Auth.seatCountFun(lockCount);
              Auth.loginHandler(clientRequest.MobileNo);
              navigate("/verOtp", {replace: true});
              setBtnActive(true);
            } else if (data.responseCode === "LOCMAXREAC-201") {
              setLimitExceed(true);
            } else {
              //reloads the [age if otp not sent
              alert("some error occured, please check your MobileNumber");
              // window.location.reload(false);
              setClientRequest({
                ...clientRequest,
                MobileNo: "",
              });
              setBtnActive(true);
            }
          })
          .catch((err) => {
            setBtnActive(true);
            console.log("err " + err);
          });
      } else {
        setBtnActive(true);
        setActiveError(true);
      }
    } else {
      setActiveWarning(true);
      setBtnActive(true);
    }
  };

  var timeLeft = 3;
  const interval = useRef();

  if (activeWarning) {
    interval.current = setInterval(() => {
      timeLeft = timeLeft - 1;
      if (timeLeft === 0) {
        setActiveWarning(false);
        clearInterval(interval.current);
      }
    }, 1000);
  }

  if (activeError) {
    interval.current = setInterval(() => {
      timeLeft = timeLeft - 1;
      if (timeLeft === 0) {
        setActiveError(false);
        clearInterval(interval.current);
      }
    }, 1000);
  }

  const hideWarningAlert = () => {
    setActiveWarning(false);
    clearInterval(interval.current);
  };

  const hideErrorAlert = () => {
    setActiveError(false);
    clearInterval(interval.current);
  };

  //for setting a phone number
  const setPhoneNumFunc = (e) => {
    if (e.target.value.length <= 10) {
      setClientRequest({
        ...clientRequest,
        [e.target.name]: e.target.value,
      });
    }
  };

  const acceptPolicy = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="loginPage-container">
      {limitExceed ? (
        <>
          <div className="limit-exceed">
            <div>
              <h4>lock booking limit Exceeded for your mobile number</h4>
            </div>

            <div className="limit-exceed-header-two">
              <h2>please try again after retrieving your lock</h2>
            </div>

            <Link to="/retrieve">
              <Button variant="contained" color="primary">
                Retrieve Lock
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="row">
          <div className={storeWindClass}>
            <img className="logo-container" src={YLogo} alt="img" width={100} />
            <div className="row">
              {/* <div className="col-md-6 col-lg-6 login-left">
                  <img src={loginBanner} className="img-fluid" alt="Login" />
                </div> */}

              <div className="form-container">
                <Stack sx={{ width: "100%" }} spacing={2}>
                  {activeError && (
                    <Alert
                      variant="standard"
                      severity="error"
                      onClose={() => hideErrorAlert()}
                    >
                      Please Accept terms and conditions!!
                    </Alert>
                  )}

                  {activeWarning && (
                    <Alert
                      variant="standard"
                      severity="warning"
                      onClose={() => hideWarningAlert()}
                    >
                      Mobile number is not valid!
                    </Alert>
                  )}
                  {/* <Alert variant="filled" severity="info">
                    This is an info alert — check it out!
                  </Alert>
                  <Alert variant="filled" severity="success">
                    This is a success alert — check it out!
                  </Alert> */}
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
                  <>
                    <div className="login-header">
                      <h3 className="login-header-text">
                        {language.LoginPage.authenticateTitle}
                      </h3>
                    </div>
                    <div className=" form-container">
                      <TextField
                        type="number"
                        label={language.LoginPage.mobileNo}
                        name="MobileNo"
                        className="passocde-input"
                        variant="outlined"
                        color="primary"
                        value={clientRequest.MobileNo}
                        onChange={(e) => setPhoneNumFunc(e)}
                        required
                        fullWidth
                        focused
                      />
                    </div>
                    <div className="form-container">
                      <FormControlLabel
                        // label={language.LoginPage.termschbox}
                        control={
                          <Checkbox
                            checked={isChecked}
                            inputProps={{ "aria-label": "controlled" }}
                            onChange={(e) => acceptPolicy(e)}
                          />
                        }
                      />
                      <Button color="primary" onClick={() => handleClickOpen()}>
                        {" "}
                        terms and conditions
                      </Button>
                    </div>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">
                        {"Terms And Conditions"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          This document is an electronic record in terms of
                          Information Technology Act, 2000 and rules thereunder
                          as applicable and the amended provisions pertaining to
                          electronic records in various statutes as amended by
                          the Information Technology Act, 2000. This electronic
                          record is generated by a computer system and does not
                          require any physical or digital signatures. Your use
                          of Website/ Application and other applications
                          developed, managed and operated by Tuckpod Storage
                          Solutions Private Limited ("us", "we", Company or
                          "our") are governed by the terms and conditions
                          ("Terms"). These Terms apply to all visitors, users
                          and others who access or use the Application and
                          Service. By accessing or using the Website,
                          Application and Service you agree to be bound by these
                          Terms. If you disagree with any part of the Terms,
                          then you may not access the Application and Service of
                          Company. The term “you/ your” or “User” refers to the
                          user of Application and Service offered commercially
                          by Company. TUCKPOD STORAGE SOLUTIONS PRIVATE LIMITED,
                          a company validly existing for the purposes of the
                          Companies Act, 2013 and having its registered office
                          at 6/3 Nala Cross, KH Road, Sudhamanagar, Bangalore
                          560027 (hereinafter referred to as ‘Company’, which
                          term shall include its transferees, novatees, assigns
                          and/or successors); For the purposes of these Terms,
                          You and Company shall individually be known as “Party”
                          and collectively be known as the “Parties”.
                          <br />
                          <b>1.DEFINITIONS </b>1.1 “Applicable Law” shall mean
                          any statutes, laws, regulations, ordinances, rules,
                          judgments, orders, decrees, by-laws, approval from the
                          concerned authority, government resolution, orders,
                          directives, guidelines, policy, requirement, or other
                          governmental restriction or any similar form of
                          decision of, or determination by, or any
                          interpretation or adjudication having the force of law
                          of any of the foregoing, by any concerned authority
                          having jurisdiction over the matter in question; 1.2
                          “Application” shall mean the software application,
                          dashboards, web and mobile applications, interactive
                          user interface, hardware and related documentation
                          which Company provides to the User, including any
                          updates thereof, whether hosted or made available
                          locally or remotely, to enable Company to provide the
                          Service to the User. 1.3 “Drop Off” shall mean use of
                          Services by third party service provider’s delivery
                          persons on behalf of the User. 1.4 “Group
                          Subscription” shall mean subscription of Services by
                          group of people such as residents association for the
                          benefit of the members of the group. 1.5 “Service”
                          shall mean the service of providing temporary storage
                          solutions by means of electronically or mechanically
                          controlled secure lockers/pods at various locations
                          through the Application, to the User by Company as per
                          these Terms.
                          <br />
                          <b>2.USER ELIGIBILITY </b> 2.1 The Application and
                          Service are available only to the User who can form
                          legally binding contracts under the Applicable Law.
                          2.2 The User must not be a minor as per Applicable Law
                          i.e. User must be at least 18 (eighteen) years of age
                          to be eligible to use the Application and Service. In
                          the event the User is a minor, it is assumed that such
                          User’s use of the Application and Service and these
                          Terms have been agreed to by the legal guardian of the
                          said User and that these Terms are legally binding.
                          2.3 The User, while accessing or using the Application
                          and Service, must follow and abide by the Applicable
                          Laws. In the event of the User being found to be not
                          eligible as per the Applicable Laws, Company reserves
                          the right to deny the Application and Service.
                          Notwithstanding the foregoing, Company at all times
                          reserves the right to deny the Application and Service
                          to the User.
                          <br />
                          <b>3.CONSENT TO THE TERMS </b> 3.1 In order to use the
                          full spectrum of Company Services, You need to
                          register on the Company Application and provide Us
                          with accurate and complete information. You are also
                          required to keep your accounts and contact information
                          complete and updated at all times. Any account found
                          to contain incorrect and/or outdated information will
                          be suspended. We reserve the right to cancel account
                          when it deems it necessary. 3.2 In case of Drop Off
                          facility availed by the User, the User shall, either
                          register themselves for the Services before allowing
                          the third party service provider delivery persons to
                          use the Pods/ Locker on behalf of the User or register
                          before retrieval of the items from Pod/ Locker. In
                          case the User chooses to register at the time of
                          retrievalof the items, it is assumed that the third
                          party services provider delivery person has used the
                          Services for User based on the specific instructions
                          and authority of the User and accordingly the User
                          shall be bound by the terms mentioned hereunder
                          including the payment of service fee as may be charged
                          by the Company. 3.3 In case of Drop Off facility, the
                          action of third party service provider delivery
                          persons to use the Services shall be considered as
                          consent of the User and User shall not raise any
                          dispute on any of the terms mentioned hereunder, it is
                          the responsibility of the User to read all the terms
                          of the Services before allowing the third party
                          service provider delivery persons to use the pods/
                          lockers. 3.4 By clicking on the tab/button/checkbox of
                          “Accept” or any other tab/button/checkbox of similar
                          nature, subject to providing any information
                          mandatorily required by the Application or Service and
                          by authorizing the third party service provider
                          delivery person to use the Services on your behalf,
                          (i) You confirm your eligibility under Applicable Law
                          to contract with Company, (ii) you accept these Terms
                          and the Privacy Policy as displayed on the Application
                          including any policies of Company updated from time to
                          time, (iii) You consent to receive communications and
                          information from us electronically (whether through
                          SMS, emails, phone calls and automated phone calls),
                          whether sent by e¬mail or other electronic means and
                          (iv) You consent to obtaining and sharing of any
                          information (including personally identifiable
                          information) with our employees, agents, associates
                          and third parties on a need-to-know basis or under
                          terms of confidentiality, for the purpose of making
                          available the Application and Service to You.
                          Electronic communications shall be deemed to have been
                          received by you when we send the electronic
                          communication to the email address/mobile
                          number/details provided by youor third party service
                          provider delivery person on your behalf during the
                          registration or accessing the Application or Service
                          as per our records, or when we post the electronic
                          communication on the Application.You understand and
                          agree that if We send you an electronic communication
                          but You do not receive it because Your email address
                          on record is incorrect, out of date, blocked by your
                          service provider, or you are otherwise unable to
                          receive electronic Communications, We shall be deemed
                          to have provided the communication to You effectively.
                          Please note that if You use a spam filter that blocks
                          or re-routes emails from senders not listed in Your
                          email address book, you must add Company to your email
                          address book so that you will be able to view the
                          Communications Company send to you. 3.5 The mobile
                          number provided by you or third party service provider
                          delivery person on behalf of you shall be linked to
                          Your account. You are allowed to use mobile number
                          other than the registered mobile number to make the
                          payments towards Service, however it is your
                          responsibility that you shall keep such mobile numbers
                          linked with your bank account to enable UPI
                          transactions, if any from Company Application. Company
                          will not be liable for any such mismatch leading to
                          your failure to access UPI transactions on Company
                          Application. 3.6 Company may ask for and store
                          additional information to either extend more Services
                          or even as an additional requirement for continuing
                          the existing Service.
                          <br />
                          <b>4.USER ACCOUNTS </b> 4.1 Company may collect User
                          data including name, email-id, contact details,
                          biometric information etc. to facilitate the Service
                          by creating a unique account of the User or by
                          identifying the User by any means as deemed fit by
                          Company. The collection, verification, audit and
                          maintenance of correct and updated User information is
                          a continuous process and Company reserves the right,
                          at any time, to take steps necessary to ensure User’s
                          compliance with all relevant and applicable KYC
                          requirements, if any. 4.2 It is assumed that all
                          information provided by the User for accessing and
                          using the Application and the Service, is correct
                          accurate and up to date. Company may verify the
                          information that User have provided and choose to
                          refuse the Service without providing reasons. Also,
                          Company reserves the right to terminate its Service on
                          account of misrepresentation of any information by the
                          User. 4.3 User account bearing details provided by the
                          User are created and owned by Company. Any access to
                          the Application and the Service may be revoked without
                          prior notice in the event of suspicious account
                          activity or malafide intent/conduct of the User. In
                          the case where the system is unable to establish
                          unique identity of the User against the details
                          provided to Company, the Service may be denied to the
                          User. Company reserves the full discretion to suspend
                          a User's account in the above event and does not have
                          the liability to share any account information
                          whatsoever. 4.4 We may use information collected about
                          you via the Application to the following among other
                          reasons: Assist law enforcement and respond to
                          subpoenas. Compile anonymous statistical data and
                          analysis for use internally or with third parties.
                          Create and manage our account. Deliver targeted
                          advertising, coupons, newsletters and promotions and
                          other information regarding the application to you.
                          Email you regarding our account or order. Notify you
                          of updates to the application. Offer new products,
                          services, mobile applications and/or recommendations
                          to you. Perform other business activities as needed.
                          Process payments and refunds. Request feedback and
                          contact you about your use of the Application. Resolve
                          disputes and troubleshoot problems. Respond to product
                          and customer service requests. Send you a newsletter.
                          <br />
                          <b>5.LICENSE</b> Company grants you a non-exclusive,
                          non-transferable end user license right to access and
                          use the Application as per these Terms for availing
                          the Services only.Company reserves all rights not
                          expressly granted to you in these Terms. The
                          Application is protected by copyright and other
                          intellectual property laws and treaties. Company or
                          its suppliers own the title, copyright and other
                          intellectual property rights on the Application.You
                          are granted an license to use the Application for
                          limited purpose and it shall not be considered or
                          assumed as Application is sold to you.
                          <br />
                          <b>6.CONSENT TO USE OF DATA</b> By using the
                          Application and/or the Service, you agree to the use
                          of your information inaccordance with the Privacy
                          Policy available on the Application and for the
                          purposes mentioned in Clause 4 hereinabove and share
                          the required information with Company business
                          associates, advisors or consultants to offer You
                          certain products, services or promotional information.
                          <br />
                          <b> 7.DISCLAIMER OF WARRANTIES </b> You acknowledge
                          the Application is provided on "as is" basis and
                          without warranty of any kind, express or implied, and
                          to the maximum extent permitted by Applicable
                          Law.Neither Company, its licensors or affiliates, nor
                          the copyright holders make any representations or
                          warranties, express or implied, including but not
                          limited to the warranties of merchantability or
                          fitness for a particular purpose or that the
                          Application will not infringe any third
                          partyIntellectual Property rights. There is no
                          warranty by Company or by any other party that the
                          functions contained in the Application will meet your
                          requirements or that the operation of the Application
                          and the Service will be uninterrupted or error-free.
                          You assume all responsibility and risk for the access
                          and use of the Application and Service to achieve your
                          intended results. Company shall not be liable for
                          inability of the User to access the Application or
                          Service due to reasons beyond the control of Company
                          or due to reasons attributable to third parties such
                          as power networks, mobile phone network, data system
                          operators, landlords of the premises hosting the
                          Service or any other third parties. There is no
                          warranty/ guarantee on protection of the itemsplaced
                          in the pods/ lockers by You or by third party service
                          provider delivery person on your behalf from any kind
                          of damage or loss. You shall be solely responsible and
                          liable for the items stored in the pods/ Lockers
                          including the damages or loss caused to Company.
                          <br />
                          <b>8.USAGE CONDITIONS</b> 8.1 Users agree to use the
                          Application and Service only for purposes that are
                          permitted by a) these Terms and b) any Applicable Laws
                          as amended from time to time and being in force. 8.2
                          By using the Application and Service; You agree not
                          to: (i) authorize others to use your account or the
                          Service on your behalf (except for any third parties
                          expressly authorized by User); (ii) assign or
                          otherwise transfer Your account to any third person or
                          legal entity; (iii) use the Application and Service
                          for storage of perishable items which has short shelf
                          life or for unlawful purposes, including but not
                          limited to sending or storing any unlawful material,
                          anti national materials, drugs, weapons, materials
                          which has threat to the security of nation or for
                          fraudulent purposes; (iv) use the Application and
                          Service to cause nuisance, annoyance or inconvenience;
                          (v) impair the proper operation of the network and/or
                          interfere with or disrupt the integrity or performance
                          of the Application and Service; (vi) reverse engineer
                          or access the Application and Service in order to
                          design or build a competitive product or service,
                          design or build a product using similar ideas,
                          features, functions or graphics of the Application and
                          Service; (vii) launch an automated program or script,
                          including, but not limited to, web spiders, web
                          crawlers, web robots, web ants, web indexers, bots,
                          viruses or worms, or any program which may make
                          multiple server requests per second, or unduly burdens
                          or hinders the operation and/or performance of the
                          Application and Service; (viii) try to harm the
                          Application and Service in any way whatsoever; (ix)
                          disclose information designated as confidential by
                          Company, without Company’s prior written consent; and
                          (x) copy or distribute the Application and Service or
                          other Company content without written permission from
                          Company. You are solely responsible for any breach of
                          your obligations under these Terms (including
                          financial obligations) and for the consequences
                          (including any loss or damage which Company may
                          suffer) as a result any such breach. 8.3 Payment
                          Conditions (i) The Company reserves the right to fix
                          the charges for Services as it deems fit and revise
                          the charges from time to time. The access to the
                          Service is granted on ‘pre-paid’ basis i.e., the User
                          will be required to pay charges as prescribed by
                          Company, in advance for the access to the Service. The
                          charges as applicable from time to time, shall be
                          displayed on the interface provided by Company and the
                          same shall be inclusive of goods and services tax. In
                          case of GroupSubscription the service charges
                          including applicable taxes will be paid by the group
                          for and on behalf the members of the group for
                          availing the Services by the members of the group. The
                          members of group shall uses unique identity code
                          provided to the group for uses of the Services under
                          Group Subscription. (ii) In the event the User uses
                          the Service for a time period in excess of the time
                          period originally booked by the User for any reason
                          whatsoever, the User shall be obligated to pay for
                          such excess time period in order to access the
                          Service. (iii) Users shall be entitled to make
                          payments for the Service through payment gateways as
                          authorised by Company or Unified Payments Interface
                          (UPI). (iv) In the event any other payment options are
                          integrated with the Application or the Service, such
                          payments option shall be made available to the User at
                          the discretion of Company. (v) Company reserves the
                          rights to proceed against you in any manner as Company
                          may deem fit (including but not limited to any court
                          process) as per Applicable Law in relation to any
                          amounts due. (vi) Company shall not be liable (a) if
                          any transaction does not fructify or may not be
                          completed or (b) for any failure on part of the bank
                          or the credit card or the third party site or agency
                          to perform any of its obligations or (c) in respect of
                          any loss or damage arising directly or indirectly
                          arising out of the decline or acceptance of
                          authorization for any transaction, for any reason
                          whatsoever. 8.4 User further agrees to: (i) have
                          understood the contract and terms and conditions laid
                          therein with Company for Application and Service usage
                          and you have clearly understood the terms related to
                          the Service; (ii) use the Services for personal
                          purpose only (applicable in case of individuals) or
                          authorized purpose only (applicable to business
                          entities, organizations and body corporate)and no
                          sub-licensing of the Services is permitted; (iii) use
                          an access point or 3G/4G/5G data account and telephone
                          networks which you are authorized to use; (iv) keep
                          account information confidential or any other
                          identification provided by Company which allows access
                          to the Service and the Application; (v) provide with
                          proof of identity/contact details/address reasonably
                          requested by Company; (vi) comply with all Applicable
                          Law while using the Application and Service; and (vii)
                          not access or attempt to access the Service by any
                          means other than through the interface that is
                          provided by Company. (viii) access the Service as per
                          timings and additional conditions prescribed by
                          third-parties premises where the Service is offered.
                          (ix) use one pod/ locker for one mobile number and not
                          to transfer the pod/ locker to any other person once
                          Service is availed by User. (x) use the pod/ locker to
                          store or drop off one item per pod/ locker. 8.5 The
                          User shall be allowed to access the Service to keep
                          the items under storage for not more than 24
                          consecutive hours, at one instance (“Time Limit”). The
                          User shall be allowed to access the Service once for
                          storage and once for retrieval, within the Time Limit.
                          Company shall alert the User regarding expiry of the
                          Time Limit by way of SMS or electronic communication
                          30 (thirty) minutes prior to the expiry of the Time
                          Limit (“Alert”)and provide the option to (a) extend
                          the Time Limit by making payment for the extended Time
                          Limit, beforeeach instance of such expiry or (b)
                          retrieve the items placed under storage upon making
                          payment for the Time Limit or the extended Time Limit,
                          as the case may be. In case of early retrieval of
                          item, there is no refund of the service charges.In the
                          event the User fails to extend the Time Limit and
                          retrieve the items placed under storage, Company shall
                          allow the use of Service for storage of items up to a
                          maximum of 72 (seventy two) consecutive hours from the
                          last Alert sent to the User (“Additional Time Limit”)
                          and the User shall have the option to retrieve the
                          items placed under storage within the Additional Time
                          Limit upon making payment for the actual hours of
                          usage of the Service. 8.6 In the event the User keeps
                          the items in storage under the Service, for a period
                          exceeding the Additional Time Limit, Company shall
                          send an Alert to the User and provide the User with
                          the following options – (a) removal of the items from
                          the Service and retention of custody of the same by
                          Company for the purpose of collection of such items by
                          the User at a later date as agreed by Company and
                          subject to an additional retrieval charge or (b)
                          disposal of the items under storage, by Company
                          without any liability whatsoever to the User. Any
                          failure on part of the User to elect the
                          aforementioned options (a) and (b) within the
                          prescribed time period, shall be deemed to be an
                          authorization to Company for disposal of the items
                          under storage, by Company without any liability
                          whatsoever to the User. 8.7 The applicable charges
                          (except the additional retrieval charge) for access to
                          the Service shall on half hourly basis on such rates
                          as displayed by Company on the interface provided to
                          the User, from time to time, regardless of the actual
                          time of usage of the Service. 8.8 The User shall not
                          be entitled to any refund for retrieval of the items
                          under storage within the Time Limit or Additional Time
                          Limit, as the case may be. 8.9 Each User shall be
                          allocated 4 (four) lockers/pods at a time as a part of
                          the Service, and such User shall be allowed to place
                          not more than 1 (one) item under storage in such
                          lockers/pods. 8.10 The User shall authorize to use
                          only the locker/pod allocated to the User as a part of
                          the Service and Company shall not be liable for loss
                          of or damage to items placed in a locker/pod not
                          allocated to the User. 8.11 The User shall be solely
                          responsible for closing/locking the locker/pod after
                          placing items under storage and Company shall not be
                          liable for loss of or damage to items placed in a
                          locker/pod if the User fails to close/lock the locker
                          after placing items under storage. 8.12 Company
                          reserves the right to immediately terminate the
                          Service and the use of the Application, should you not
                          comply with any of the above terms. 8.13 In the event
                          the User is unable to access the Service or has reason
                          to believe that the Service has malfunctioned or that
                          the Service is affected adversely due to any technical
                          issue which is directly attributable to Company, the
                          User may contact Company at @ info@tuckpod.com
                          <br />
                          <b>
                            9.ARRANGEMENT BETWEEN YOU AND THE PAYMENT GATEWAY
                          </b>{" "}
                          9.1 All payments are processed using a payment gateway
                          or appropriate payment system infrastructure and the
                          same will also be governed by the terms and conditions
                          agreed to between You and the respective and the
                          payment gateway. 9.2 All online bank transfers from
                          valid bank accounts are processed using the gateway
                          provided by the third parties which support payment
                          facility to provide these services to you. All such
                          online bank transfers on payment facility are also
                          governed by the terms and conditions agreed to between
                          you and the third party.
                          <br />
                          <b>10. NO LIABILITY FOR ITEMS IN STORAGE </b> The User
                          understand and agrees the items placed in storage
                          under the Service including Drop Off are at the sole
                          and entire risk of the User and that by opting for the
                          Service, the User shall not hold Company liable or
                          responsible in respect of any loss or damages cause to
                          the items in storage under the Service or for any
                          reason whatsoever including but not limited to the
                          User's non-¬compliance with these Terms, malfunction,
                          partial or total failure of any network terminal, data
                          processing system, computer telecom transmission or
                          telecommunications system or other circumstances
                          whether or not beyond the control of Company or any
                          person or any organization involved in the above
                          mentioned systems. Provided that the Company will only
                          be liable in the event the loss or damages cause to
                          the items in storage under the Service are solely
                          attributable to Company (excluding perishable items or
                          items required to be stored under special conditions
                          e.g. temperature or humidity control). The User shall
                          adhere to the conditions of access to the place where
                          pod/ locker is placed and follow the timings and
                          security policies of the place. In case the User is
                          unable to access the pod/ locker due to timing
                          restrictions or for other security reasons then the
                          User shall not claim any damages on the Company.
                          <br />
                          <b>11.MISUSE OF SERVICE</b> The User agrees to not
                          access or use the Service and Application or any
                          components or elements comprised in the Service and
                          Application including but not limited to the lockers
                          and pods, in contravention of these terms and
                          Applicable Laws. The User agrees not to damage or
                          cause harm to the Service or any components or
                          elements comprised in the Service and Application or
                          abandon the items placed in storage under the Service
                          and holds Company harmless in respect of the said
                          items and indemnifies Company in respect of any costs
                          or liability arising upon Company due to misuse of the
                          Service or abandonment of items placed in storage
                          under the Service or from any damage or harm to the
                          Service and the Application or any components or
                          elements comprised in the Service and the Application.
                          Company may communicate or contact the User in the
                          event of abandonment of the Service or items placed in
                          storage under the Service, not more than two times and
                          if there is no response from the User, Company shall
                          not be liable for the items placed in storage under
                          the Service.
                          <br />
                          <b>12.SECURITY</b> The User understands and agrees
                          that the Service is made available to the Users at
                          third-party premises and shall be subject to security
                          measures applied by Company and such third-parties
                          including but not limited to surveillance by means of
                          close-circuit cameras to prevent instances of general
                          vandalism and misuse of the Service and the User
                          agrees and consents to abide by any such security
                          measures by Company or such third parties and agrees
                          that such security measures do not constitute any
                          infringement upon the privacy of the User. We use
                          administrative, technical and physical security
                          measures to help protect your personal information.
                          While we have taken reasonable steps to secure the
                          personal information you provide to us, please be
                          aware that despite our efforts, no security measures
                          are perfect or impenetrable and no method of data
                          transmission can be guaranteed against any
                          interception or other type of misuse. Any information
                          disclosed online is vulnerable to interception and
                          misuse by unauthorized parties. Therefore, we cannot
                          guarantee complete security if you provide personal
                          information.
                          <br />
                          <b>13.REFUND</b> The User shall not be entitled for
                          refund of amounts paid in respect of the Service
                          availed by the User wherein the User has used the
                          Service for a time less than the time opted by the
                          User. The User shall only be entitled to refund of any
                          incremental amounts paid to Company due to billing
                          errors, within a period of 7 to 10 days from the date
                          of the User raising a refund request with Company.
                          <br />
                          <b>
                            {" "}
                            14.COMPLIANCE WITH COURT OR GOVERNMENT ORDERS{" "}
                          </b>{" "}
                          In the event Company is required to disclose the
                          particulars of items under storage or grant access to
                          the items under storage to any governmental
                          authorities pursuant to any investigation process,
                          court or government orders, Company shall comply with
                          such investigation process, court or government orders
                          and shall not liable to the User for such disclosure
                          or grant of access.
                          <br />
                          <b>15.AUTHENTICATION</b> 15.1 In order to provide
                          access to the Service to the User, Company shall
                          authenticate the User by means of sending
                          one-time-password number (OTP) to the User or through
                          biometric (fingerprint) identification of the User or
                          through a passkey. In the event the User fails to
                          submit the correct OTP or identify himself by means of
                          biometric information or passkey by more than 2 (two)
                          times and fails to authenticate itself, the access to
                          Service shall be suspended for 2 (two) hours. The
                          Service will only be resumed upon submission of the
                          correct OTP or biometric identification or passkey to
                          Company by the User and payment of amounts due, if
                          any, by the User. It is the responsibility of Customer
                          to remember the passkey. 15.2 The User shall have the
                          option of nominating any other person on behalf of the
                          User to access the Service, provided such access to
                          the Service shall be granted by Company only upon
                          authentication of such person by means of sending
                          one-time-password number (OTP) to the User. Upon
                          authentication, any actions or inactions on the part
                          of such person with regards to the Service or access
                          thereof shall be deemed to that of the User and the
                          User shall be wholly liable for such actions of
                          inactions of the said person or any breach of these
                          Terms by the said person. For the purpose of these
                          terms, such other person shall be deemed to be the
                          agent of the User and the User shall be liable for any
                          actions of such other person. The User shall not share
                          credentials with said person and shall ensure that all
                          confidential information’s are kept confidential.
                          <br />
                          <b>16.FORCE MAJEURE</b> Any delay or failure to
                          provide access to the Application and Service
                          hereunder shall be excused if and to the extent caused
                          by the occurrence of a Force Majeure. For the purposes
                          of this Agreement, “Force Majeure” shall mean a cause
                          or event that is not reasonably foreseeable or not
                          otherwise caused by or under the control of the Party
                          claiming Force Majeure, including acts of God,
                          pandemic, fires, floods, explosions, riots, wars,
                          hurricane, epidemics, sabotage, terrorism, vandalism,
                          accident, restraint of government, governmental acts,
                          change in government, injunctions, labour strikes,
                          internet outage, power outage, network failure,
                          failure of components/cables/subsystems and other like
                          events that are beyond the reasonable control of
                          Company affected thereby, despite the Company's
                          reasonable efforts to prevent, avoid, delay, or
                          mitigate the effect of such acts, events or
                          occurrences, and which events or the effects thereof
                          are not attributable to the Company's failure to
                          provide access to the Application and Service.
                          <br />
                          <b>17.LIMITATION OF LIABILITY</b> It is agreed that
                          Company and its affiliates, employees, directors,
                          agents shall not be liable, for any direct, indirect,
                          incidental, consequential, punitive damages
                          (including, without limitation, lost profits, cost of
                          procuring substitute service, loss of opportunity), or
                          any peril to the life and limb, however caused to the
                          User, arising out of access to Application and
                          Service. In the event of any loss or damages caused to
                          the User due to actions solely attributable to
                          Company, the liability of the Company shall be limited
                          to the consideration paid by the User in relation to
                          access and use of the Service.
                          <br />
                          <b>18.SEVERABILITY</b> If any provision of this
                          Agreement is held by a court of competent jurisdiction
                          to be invalid, illegal, or unenforceable, then the
                          remainder of this Agreement shall remain in full force
                          and effect. In the event any such provision previously
                          held to be invalid, illegal, or unenforceable, is
                          thereafter held by a court of competent jurisdiction
                          to be valid, legal, or enforceable, then said
                          provision shall automatically be revived and
                          incorporated into this Agreement.
                          <br />
                          <b>19.GOVERNING LAW AND JURISDICTION</b> This
                          Agreement, all transactions executed hereunder, and
                          the legal relations between the Parties shall be
                          governed and construed solely in accordance with the
                          laws of India and the courts of Bengaluru shall have
                          exclusive jurisdiction.
                          <br />
                          <b>20.ENTIRE AGREEMENT</b>
                          TheseTerms along with the Privacy Policy available at
                          www.tuckpod.com, constitute the complete and exclusive
                          understanding and agreement of the Parties and
                          supersede all prior understandings and agreements,
                          whether written or oral, with respect to the subject
                          matter herein.
                          <br />
                          <b>21.TERMINATION </b> These Terms are effective until
                          terminated. Your rights under these Terms will
                          terminate automatically without notice from Company if
                          you fail to comply with these Terms. Upon termination
                          of these Terms, you must cease all use of the
                          Application and Service. If you wish to terminate
                          these Terms, you may discontinue the access and use of
                          the Application and Service.
                          <br />
                          <b>22. INDEMNITY</b> User agrees to defend, indemnify
                          and to hold harmless Company, its officers, agents,
                          employees, from and against loss, damage, cost and
                          expense of claims and suits seeking damage alleged to
                          have been caused by or attributed to or arising
                          directly or indirectly by User’s access to or use of
                          Service, violation of this Agreement, or infringement,
                          or infringement by any other User of his/her/its
                          account, of any intellectual property or other right
                          of any person or entity including the cost and
                          expenses of handling said claims and defending said
                          suits. The right to indemnity of a Party under this
                          shall be without prejudice to any other right or
                          remedy that may be available to such Party under this
                          Agreement / applicable Law or equity.
                          <br />
                          <b>23. INTELLECTUAL PROPERTY RIGHTS</b> Intellectual
                          Property Rights for the purpose of this Terms shall
                          always mean and include copyrights whether registered
                          or not, patents including rights of filing patents,
                          trademarks, trade names, trade dresses, house marks,
                          collective marks, associate marks and the right to
                          register them, designs both industrial and layout,
                          geographical indicators, moral rights, broadcasting
                          rights, displaying rights, distribution rights,
                          selling rights, abridged rights, translating rights,
                          reproducing rights, performing rights, communicating
                          rights, adapting rights, circulating rights, protected
                          rights, joint rights, reciprocating rights,
                          infringement rights. All those Intellectual Property
                          rights arising as a result of domain names, internet
                          or any other right available under applicable law
                          shall vest in the domain of Company as the owner of
                          such domain name. The Parties hereto agree and confirm
                          that no part of any Intellectual Property rights
                          mentioned hereinabove is transferred in the name of
                          User and any intellectual property rights arising as a
                          result of these presents shall also be in the absolute
                          ownership, possession and Our control or control of
                          its licensors, as the case may be.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="info"
                          variant="outlined"
                          onClick={handleClose}
                          autoFocus
                        >
                          OK
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {btnActive ? (
                      <div className="btn-container">
                        <Button
                          variant="contained"
                          type="button"
                          className="mui-btn-color"
                          onClick={(e) => sendOtpFun(e)}
                          endIcon={<ScheduleSendIcon />}
                          fullWidth
                        >
                          {language.LoginPage.otpBtn} &nbsp;&nbsp;&nbsp;
                        </Button>
                      </div>
                    ) : (
                      <div className="btn-container">
                        <LoadingButton
                          loading
                          loadingPosition="end"
                          endIcon={<SaveIcon />}
                          variant="contained"
                          fullWidth
                        >
                          generating otp...
                        </LoadingButton>
                      </div>
                    )}
                  </>
                </Box>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}

export default LoginPage;
