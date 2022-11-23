import { createContext, useContext, useState } from 'react'
const RetriveAuthContext = createContext(null);

export const RetriveAuthProvider = ({children}) => {

    const [MobileNo, setMobileNo] = useState(null);

    const [retrieveLockSelected, setRetrieveLockSelected] = useState([]);

    const [retriveLockContainer, setRetriveLockContainer] = useState({
        LOCKNO:[],
    })

    const [excessUsageItems, setExcessUsageItems] = useState({
        eamount:'',
        EXHour:''
    });

    const [postPayItem, setPostPayItems] = useState({
        amount:'',
        Hour:''
    })

    const [postPayAndExcessUsage, setPostPayAndExcessUsage] = useState({
        amount:'',
        Hour:'',
        eamount:'',
        EXHour:''
    })
    
    const retriveMobileNoHandler = (mobNo) => {
        const mobileNo = mobNo
        setMobileNo(mobileNo)
    }

    const logoutHandler = () => {
        setMobileNo(null)
    }

    const setRetriveDet = (obj) => {
        const respObj = obj
        console.log(respObj)
        setRetriveLockContainer({
            ...retriveLockContainer,
            // LOCKNO:respObj.LOCKNO,
            // terminalID:respObj.terminalID
            ...respObj
        })
    }

    //excess usage handler
    const excessUsageHandler = (obj) => {
        const myObj = obj;
        setExcessUsageItems({
            ...excessUsageItems,
            eamount:myObj.eamount,
            EXHour:myObj.EXHour
        })
    }

    //for post pay handler
    const postPayHandler = (obj) => {
        const myObj = obj;
        setPostPayItems({
            ...postPayItem,
            amount:myObj.amount,
            Hour:myObj.Hour
        })
    }

    const selectedLockersToRetrieve = (locks) => {
        setRetrieveLockSelected(locks)
    }

    //for post pay and excessUsage handler
    const postPayAndExcessUsageHandler = (obj) => {
        const myObj = obj;
        setPostPayAndExcessUsage({
            ...postPayAndExcessUsage,
            amount:myObj.amount,
            Hour:myObj.Hour,
            eamount:myObj.eamount,
            EXHour:myObj.EXHour
        })
    }

    return (
        <RetriveAuthContext.Provider
        value={{
            MobileNo,
            retriveMobileNoHandler,
            logoutHandler,
            setRetriveDet,
            retriveLockContainer,
            excessUsageHandler,
            postPayHandler,
            postPayAndExcessUsageHandler,
            excessUsageItems,
            postPayItem,
            postPayAndExcessUsage,
            retrieveLockSelected,
            selectedLockersToRetrieve
        }}
        >{children}</RetriveAuthContext.Provider>
    )
}

export const useRetriveAuth = () => {
    return useContext(RetriveAuthContext);
}