
// import {Contract} from '@ethersproject/contracts'
// import {Web3Provider} from '@ethersproject/providers'
// import React, {useState} from 'react'
// import masterchef from "./masterchef";
//
// export const getAllowance = (
//     const contract = new Contract("0x8bBc07cC5a774Ac263BD39487183aD90D3DA6B0b", masterchef, library)
//     contract.pendingFish(4, account).then((balance) => {
//         try {
//             return balance
//         } catch (e) {
//             return '0'
//         }
//     })
// }



export const handleGetBalance  = (account, masterchef, library) => {
    return library
        .getBalance(account)
        .then((balance) => {
            return balance
        })
        .catch((balance) => {
            return balance
        })
    // console.log(account)
    // console.log(masterchef)
    // console.log(library)
}

