import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [occupiedLocks, setOccupiedLocks] = useState([]);
  const [currentPosition, SetCurrentPosition] = useState({
    lat: "",
    long: ""
  });

  const [userSelectedLockNo, setUserSelectedLockNo] = useState("");

  const [passcode, setPasscode] = useState("");
  const [seatBookCount, setSeatBookCount] = useState(0)

  const [userDetails, setUserDetails] = useState({
    MobileNo: "",
    terminalID: "",
    TransactionId: "",
    userName: "",
    AvailableLocker: [],
    dob: "",
    hours: [],
    smallLockPriceMinute: "",
    mediumLockPriceMinute: "",
    largeLockPriceMinute: "",
    extraLargePriceMinute: "",
    smallLockPriceHours: [],
    largeLockPriceHours: [],
    mediumLockPriceHours: [],
    extraLargePriceHours: [],
  });

  // for counting the seat books
  const seatCountFun = (count) => {
    const totCount = seatBookCount+count;
    // alert("total count : "+totCount)
    setSeatBookCount(totCount);
  }

  const loginHandler = (val) => {
    setPhoneNumber(val);
  };

  const passcodeHandler = (val) => {
    setPasscode(val);
  }

  const logoutHandler = () => {
    // setOccupiedLocks([]);
    // setPhoneNumber(null);
    window.location.reload();
  };

  const existingUserHandler = (obj) => {
    setUserDetails({
      ...userDetails,
      ...obj,
    });
  };

  const geoLocationHandler = (obj) => {
    SetCurrentPosition({
      ...currentPosition,
      lat: obj.lat,
      long:obj.long
    })
  }

  const busyLockerFunction = (lockName) => {
    // if (occupiedLocks !== null) {
    //   const locks = [...occupiedLocks, ...lockName];
    //   setOccupiedLocks(locks);
    // } else {
      
    // }
    setOccupiedLocks(arr => [...arr, lockName]);
  };

  const userSelectedLockHandler = (lock) => {
    const lockName = lock;
    console.log(lockName)
    setUserSelectedLockNo(lockName)
    
  }

  return (
    <AuthContext.Provider
      value={{
        loginHandler,
        logoutHandler,
        phoneNumber,
        existingUserHandler,
        userDetails,
        busyLockerFunction,
        occupiedLocks,
        currentPosition,
        geoLocationHandler,
        seatBookCount,
        seatCountFun,
        passcode,
        passcodeHandler,
        userSelectedLockHandler,
        userSelectedLockNo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
