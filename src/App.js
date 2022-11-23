import "./App.css";
import { useContext } from "react";
import { themeContext } from "./Context";
import Seatbooking from "./seat_availabe/Seatbooking";
import LoginPage from "./loginpage/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserAuthenticate from "./loginpage/UserAuthentication/UserAuthenticate";
import RetriveLock from "./RetrivePage/RetriveLock/RetriveLock";
import { AuthProvider } from "./GlobalFunctions/Auth";
import RequireAuth from "./GlobalFunctions/RequireAuth";
import RetrivePage from "./RetrivePage/RetrivePage";
import PayementSuccess from "./payementSuccess/PaymentSuccess";
import ConfirmOtp from "./RetrivePage/ConfirmOtp";
import { RetriveAuthProvider } from "./GlobalFunctions/RetriveAuth";
import ForgotPasscode from "./RetrivePage/ForgotPasscode";
import LoginOtp from "./loginpage/LoginOtp";
import StoreOrRetrive from "./loginpage/StoreOrRetrive";
import RetriveSuccess from "./RetrivePage/retriveSuccess/RetriveSuccess";
import RequireRetriveAuth from "./GlobalFunctions/RequireRetriveAuth";
import RetrivePayment from "./RetrivePage/retrivePayment/RetrivePayment";
import PostPay from "./payementSuccess/PostPay";
import VerifyLockOpen from "./verifyLockOpen/VerifyLockOpen";
import VerLockOpenRetrieve from "./RetrivePage/verifyLockOpenRetrive/VerLockOpenRetrieve";
import { LangContextProvider } from "./GlobalFunctions/LanguageFun";
import TermsAndCondition from "./termsAndCondition/TermsAndCondition";
import TerminalIdAuth from "./GlobalFunctions/TerminalIdAuth";

function App() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  // const handleClick = () => {
  //   // debugger
  //   theme.dispatch({ type: "toggle" });
  // };
  return (
    <div
      className="App"
      style={{
        background: darkMode ? "black" : "",
        color: darkMode ? "white" : "",
        paddingLeft: "10%",
        paddingRight: "10%",
        marginTop: "2%",
      }}
    >
      <AuthProvider>
        <RetriveAuthProvider>
          <LangContextProvider>
            <Router>
              <Routes>
                <Route
                  path="/retrievePay"
                  element={
                    <RequireRetriveAuth>
                      <RetrivePayment />
                    </RequireRetriveAuth>
                  }
                />
                <Route
                  path="/retrieve"
                  element={
                    <TerminalIdAuth>
                      <RetrivePage />
                    </TerminalIdAuth>
                  }
                />
                <Route
                  path="/retrieveSuccess"
                  element={
                    <RequireRetriveAuth>
                      <RetriveSuccess />{" "}
                    </RequireRetriveAuth>
                  }
                />
                <Route path="/storeRetrieve" element={<StoreOrRetrive />} />

                <Route
                  path="/forgotPass"
                  element={
                    <TerminalIdAuth>
                      <ForgotPasscode />
                    </TerminalIdAuth>
                  }
                />
                <Route
                  path="/retrieveLock"
                  element={
                    <RequireRetriveAuth>
                      <RetriveLock />
                    </RequireRetriveAuth>
                  }
                />
                <Route
                  path="/checkotp"
                  element={
                    <RequireRetriveAuth>
                      <ConfirmOtp />
                    </RequireRetriveAuth>
                  }
                />
                <Route
                  path="/verlockopenret"
                  element={
                    <RequireRetriveAuth>
                      <VerLockOpenRetrieve />
                    </RequireRetriveAuth>
                  }
                />

                <Route
                  path="/login"
                  element={
                    <TerminalIdAuth>
                      <LoginPage />
                    </TerminalIdAuth>
                  }
                />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Seatbooking />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/userAuth"
                  element={
                    <RequireAuth>
                      <UserAuthenticate />{" "}
                    </RequireAuth>
                  }
                />

                <Route
                  path="/verOtp"
                  element={
                    <RequireAuth>
                      <LoginOtp />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/success"
                  element={
                    <RequireAuth>
                      <PayementSuccess />{" "}
                    </RequireAuth>
                    // <PayementSuccess />
                  }
                />

                <Route
                  path="/postpay"
                  element={
                    <RequireAuth>
                      <PostPay />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/verOpenLock"
                  element={
                    <RequireAuth>
                      <VerifyLockOpen />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/termsAndCond"
                  element={
                    <RequireRetriveAuth>
                      <TermsAndCondition />
                    </RequireRetriveAuth>
                  }
                />
              </Routes>
            </Router>
          </LangContextProvider>
        </RetriveAuthProvider>
      </AuthProvider>
      {/* <Otp /> */}
      {/* <Login /> */}
      {/* <Seatbooking /> */}
    </div>
  );
}

export default App;
