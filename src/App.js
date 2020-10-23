import React, {useCallback} from 'react'
import {Web3ReactProvider} from '@web3-react/core'
import {Web3Provider} from '@ethersproject/providers'
import {useWeb3React} from '@web3-react/core'
import {InjectedConnector} from '@web3-react/injected-connector'
import {formatEther} from '@ethersproject/units'
import {Contract} from '@ethersproject/contracts'
import masterchef from './utils/masterchef'
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'
import {handleGetBalance} from './utils/index'

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        1, // Mainet
        3, // Ropsten
        4, // Rinkeby
        5, // Goerli
        42, // Kovan
    ],
})

function getLibrary(provider) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function Balance() {
    const {account, library, chainId} = useWeb3React()
    const [balance, setBalance] = React.useState(0)
    const [fishBalance, setFishBalance] = React.useState(0)
    React.useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            //console.log(library)
            library
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        console.log(balance)
                        setBalance(balance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(null)
                    }
                })
            // const contract = new Contract("0x8bBc07cC5a774Ac263BD39487183aD90D3DA6B0b", masterchef, library)
            // contract.pendingFish(4, account).then((balance) => {
            //     //console.log(balance)
            //     setFishBalance(balance)
            // })

            handleGetBalance("0x8bBc07cC5a774Ac263BD39487183aD90D3DA6B0b", masterchef, library).then(res =>{
                setFishBalance(res)
            })

            return () => {
                stale = true
                setBalance(undefined)
            }
        }
    }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds
    const haravest = useCallback(() => {

        const contract = new Contract("0x8bBc07cC5a774Ac263BD39487183aD90D3DA6B0b", masterchef, library.getSigner())
        contract.deposit(4, 0).then((tx) => {
            //console.log(tx)
            return tx.transactionHash
        })
    }, [library])
    return (
        <>
            <span>Balance:</span>
            <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span><br></br>
            <span>FishBalance:</span>
            <span>{fishBalance === null ? 'Error' : fishBalance ? `Ξ${formatEther(fishBalance)}` : ''}</span><br></br>
            <button type="button" onClick={haravest}>Haravest</button>
        </>
    )
}

export const Wallet = () => {
    const {chainId, account, activate, active} = useWeb3React()

    const onClick = () => {
        activate(injectedConnector)
    }

    return (
        <div>
            <Router>
                {/*头部栏*/}
                <NavLink to="/">home</NavLink>
                <br/>
                <NavLink to="/farms">farms</NavLink>
                <br/>
                <NavLink to="/faq">faq</NavLink>
                <br/><br/><br/>
                <Switch>
                    <Route path="/" exact>
                        {/*首页*/}
                        <div>ChainId: {chainId}</div>
                        <div>Account: {account}</div>
                        <Balance></Balance>
                        {active ? (
                            <div>完成 </div>
                        ) : (
                            <button type="button" onClick={onClick}>
                                Connect
                            </button>
                        )}
                    </Route>
                    <Route path="/farms">
                        {/*farms页*/}
                        <div>farms页</div>
                    </Route>
                    <Route path="/faq">
                        <div>faq页</div>
                    </Route>
                </Switch>
            </Router>
            {/*<div>ChainId: {chainId}</div>
            <div>Account: {account}</div>
            <Balance></Balance>
            {active ? (
                <div>完成 </div>
            ) : (
                <button type="button" onClick={onClick}>
                    Connect
                </button>
            )}*/}
        </div>
    )
}

export const App = () => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Wallet/>
        </Web3ReactProvider>
    )
}