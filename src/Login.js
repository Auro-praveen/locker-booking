import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
// import otp from "./otp/Otp";
// import {Routes, Route, useNavigate} from 'react-router-dom';

import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import loginBanner from "./img-02.jpg";
import { themeContext } from "./Context";
import moment from "moment";

// import "./LoginStyle.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { text } from "@fortawesome/fontawesome-svg-core";
function Login(props) {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  //   const [enterDate,setEnterDate] = useState(null);
  const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const dateValue = moment(new Date()).format("YYYY-MM-DD");
  const [enterDate, setEnterDate] = useState(dateValue);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    dateofBirth: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    dateofBirth: "",
  });

  const [formValidity, setFormValidity] = useState({
    email: false,
    password: false,
    dateofBirth: "",
  });

  const [type, setType] = useState("password");

  const handleClick = () => {
    // debugger
    theme.dispatch({ type: "toggle" });
  };

  const showHide = () => {
    //e.preventDefault();
    //e.stopPropagation();
    if (type == "input") {
      setType("password");
    }

    if (type == "password") {
      setType("input");
    }
  };

  const handleChange = (event) => {
    formValues[event.target.name] = event.target.value;
  };

  const handleSubmit = (values, { props = props, setSubmitting }) => {
    // alert(JSON.stringify(values, null, 2));
    // props.login(values.email, values.password);
    setSubmitting(false);
    console.log("values submitted == ", values);
    return;
  };

  const navigateToLogin = () => {
    // 👇️ navigate to /contacts
    props.history.push("/Otp");
  };

  const handleDateOfBirth = (date) => {
    //  const Dateset = moment(data).format("YYYY-MM-DD");
    setEnterDate(date);
  };
  return (
    // <div className="container-fluid" style={{}}>
    <Container
      style={{
        background: darkMode ? "black" : "",
        color: darkMode ? "white" : "",
      }}
    >
      <Card
        className="rounded shadow"
        style={{
          background: darkMode ? "black" : "",
          color: darkMode ? "white" : "",
        }}
      >
        <CardBody>
          <div className="row">
            <div className="">
              <div className="row">
                <div className="col-md-6 col-lg-6 login-left">
                  <img src={loginBanner} className="img-fluid" alt="Login" />
                </div>

                <div className="col-md-6 col-lg-6 login-right ">
                  <div className="login-header">
                    <h3 style={{ textAlign: "center" }}>
                      <strong>Hello again !!</strong>
                    </h3>
                    <p>It's great to have you back</p>
                  </div>

                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                      dateofBirth: "",
                    }}
                    validate={(values) => {
                      let errors = {};
                      if (values.email === "") {
                        errors.email = "User name is required";
                      } else if (!emailTest.test(values.email)) {
                        // errors.email = "Invalid email address format";
                        errors.email = "Invalid user name";
                      }
                      if (values.password === "") {
                        errors.password = "Password is required";
                      } else if (values.password.length < 10) {
                        errors.password = "invalid mobile number";
                      }
                      if (values.dateofBirth === "") {
                        errors.password = "DOB is required";
                      } else if (values.dateofBirth.length < 10) {
                        errors.password = "invalid mobile number";
                      }
                      return errors;
                    }}
                    onSubmit={handleSubmit}
                  >
                    {({ touched, errors, isSubmitting }) => (
                      <React.Fragment>
                        <Form className="px-5">
                          <div className="mb-2">
                            {/* <div className="form-group form-focus">
												<input type="text" className={`form-control floating ${
                                touched.mobile && errors.mobile ? "is-invalid" : ""
                                }`} maxlength="10"/>
												<label className="focus-label">Mobile Number</label>
											</div> */}

                            <Field
                              type="text"
                              name="name"
                              placeholder="Enter mobile number"
                              className={`form-control ${
                                touched.email && errors.email
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              component="div"
                              name="email"
                              className="invalid-feedback"
                            />
                          </div>
                          <div className="mb-3">
                            {/* <div className="form-group form-focus">
												<input type={this.state.type} className={`form-control floating ${
                                touched.mpin && errors.mpin ? "is-invalid" : ""
                                }`} maxlength="4" />
												<span className="float-right" onClick={this.showHide}>{(this.state.type === 'input') ? (<i class="fas fa-eye-slash"></i>):(<i class="fas fa-eye"></i>)}</span>
												<label className="focus-label">MPIN</label>
												
											</div> */}

                            <Field
                              type="text"
                              name="number"
                              placeholder="Enter Phone Number"
                              className={`form-control ${
                                touched.password && errors.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />

                            <ErrorMessage
                              component="div"
                              name="password"
                              className="invalid-feedback"
                            />
                          </div>

                          {/* date picker */}
                          <div className="mb-1">
                            {/* <DatePicker
                           id="date"
                           type="date"
                           defaultValue={enterDate}

                           onChange={(date) => handleDateOfBirth(date)}
                           {
                            touched.enterDate && errors.enterDate ? (
                              <div
                                style={{
                                  color: "red"
                                }}
                              >
                                {errors.enterDate}
                              </div>
                            ) : null}

                          /> */}

                            <DatePicker
                              placeholderText="Enter the date of birth"
                              captureDate={enterDate}
                              onChange={(date) => handleDateOfBirth(date)}
                              // onChange={date=>setEnterDate(date)}
                              dateFormat="dd/mm/yyyy"
                              className={`form-control ${
                                touched.dateofBirth && errors.dateofBirth
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              component="div"
                              name="dateofBirth"
                              className="invalid-feedback"
                            />
                          </div>
                          {/* <button onClick={navigateToContacts}>Contacts</button> */}
                          {/* <Link to= "/users/dashboard"> */}
                          <button
                            className="btn btn-primary btn-block btn-lg login-btn"
                            type="submit"
                            disabled={isSubmitting}
                            onClick={navigateToLogin}
                          >
                            submit
                          </button>
                          {/* </Link> */}

                          {/* <button className="" tabindex="0" type="button" style={{height: "56px"}}>
                                                    <div className="">
                                                    <div className="css-1xqne3k"><svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z" id="Shape" fill="#EA4335">

                                                    </path><path d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z" id="Shape" fill="#FBBC05"></path>
                                                    <path d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z" id="Shape" fill="#4285F4"></path>
                                                    <path d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z" fill="#34A853"></path>
                                                    </svg></div>Sign in with Google</div><span className=""></span></button> */}
                        </Form>

                        {/* <div className="text-center" style={{
    
    marginTop: "20px",
    fontSize: "16px",
    color: darkMode ? "white" : "#3d3d3d",
}}>Don’t have an account?
                                                    <a style={{color: "#e97a24", cursor:"pointer"}}> Sign Up</a></div> */}
                      </React.Fragment>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <button className="btn btn-primary mt-4" onClick={() => handleClick()}>
        DARK MODE
      </button>
    </Container>
    // </div>
  );
}

export default Login;
