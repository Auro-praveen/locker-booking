import React, { useState } from "react";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import "./retriveLock.css";
import { Button } from "@mui/material";
import serverUrl from "../../GlobalVariable/serverUrl.json";
import { useNavigate } from "react-router";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import YLogo from "../../logos/logo_yellow.png";
import { useAuth } from "../../GlobalFunctions/Auth";

function RetriveLock() {
  const RetriveAuth = useRetriveAuth();
  const [retriveLockers, setRetriveLockers] = useState(
    RetriveAuth.retriveLockContainer.LOCKNO
  );

  const [retriveLockItems, setRetriveLockItems] = useState({
    PacketType: "retropenloccnf",
    MobileNo: RetriveAuth.MobileNo,
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
    LockerNo: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const retriveLockHandler = (rLock) => {
    if (retriveLockItems.LockerNo.indexOf(rLock) > -1) {
      let lockSelected = [...retriveLockItems.LockerNo];
      lockSelected.splice(lockSelected.indexOf(rLock), 1);
      setRetriveLockItems({
        ...retriveLockItems,
        LockerNo: lockSelected,
      });
    } else {
      // setRetriveSelectedLock((locks) => [...locks, rLock]);
      const lockers = [...retriveLockItems.LockerNo, rLock];
      setRetriveLockItems({
        ...retriveLockItems,
        LockerNo: lockers,
      });
    }
  };
  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const openLockUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/OpenLockHandler";
  const submitRetriveLock = () => {
    if (retriveLockItems.LockerNo.length > 0) {
      setIsLoading(true);

      console.log(retriveLockItems)
      RetriveAuth.selectedLockersToRetrieve(retriveLockItems.LockerNo)
      fetch(/* openLockUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(retriveLockItems),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "LOCEX-200") {
            alert("excess usage");
            const items = {
              eamount: data.eamount,
              EXHour: data.EXHour,
            };
            RetriveAuth.excessUsageHandler(items);
            navigate("/retrievePay", { replace: true });
            setIsLoading(false);
          } else if (data.responseCode === "LOCPO-200") {
            alert("selected post paid");
            const items = {
              amount: data.amount,
              Hour: data.Hour,
            };
            RetriveAuth.postPayHandler(items);
            navigate("/retrievePay", { replace: true });
            setIsLoading(false);
          } else if (data.responseCode === "LOCPAEX-200") {
            alert("Excess amount and post paid");
            const items = {
              amount: data.amount,
              Hour: data.Hour,
              eamount: data.eamount,
              EXHour: data.EXHour,
            };
            RetriveAuth.postPayAndExcessUsageHandler(items);
            navigate("/retrievePay", { replace: true });
            setIsLoading(false);
          } else if (data.responseCode === "LOCRS-200") {
            navigate("/verlockopenret", { replace: true });
            // navigate("/retriveSuccess", { replace: true });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err : " + err);
        });
    } else {
      alert("choose a lock");
    }
  };

  return (
    <div className="retrieve-lock-container">
      <div className="retrive-lock-wind">
        <img className="logo-container" src={YLogo} alt="img" width={100} />
        <h3 className="retrive-lock-header">Retrieve your items here</h3>
        <div className="retrive-lock-content">
          {retriveLockers.map((lock, index) => (
            <button
              className={
                retriveLockItems.LockerNo.indexOf(lock) > -1
                  ? "retrive-locks-selected"
                  : "retrive-locks"
              }
              key={index}
              onClick={() => retriveLockHandler(lock)}
            >
              <h2>{lock}</h2>
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="btn-container">
            <LoadingButton
              loading
              loadingPosition="end"
              endIcon={<SaveIcon />}
              variant="contained"
              color="warning"
              fullWidth
            >
              wait ...
            </LoadingButton>
          </div>
        ) : (
          <div className="btn-container">
            <Button
              variant="contained"
              className="mui-btn-color-yellow"
              color="warning"
              onClick={() => submitRetriveLock()}
              fullWidth
            >
              open lock
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RetriveLock;
