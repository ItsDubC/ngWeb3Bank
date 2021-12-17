//import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import Web3 from 'web3';

const Usdc = require('../../../../truffle_abis/Usdc.json');
const Abrt = require('../../../../truffle_abis/Abrt.json');
const AirBank = require('../../../../truffle_abis/AirBank.json');

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3ContractService {
  accounts: string[] = [];
  accountId: string = '';
  usdcContract: any = null;
  abrtContract: any = null;
  airBankContract: any = null;

  private isWeb3EnabledPromise: Promise<boolean>;

  constructor() {
    this.isWeb3EnabledPromise = this.loadWeb3().then((result) => {
      return result;
    });
  }

  public isWeb3Enabled() {
    return from(this.isWeb3EnabledPromise);
  }

  private async loadWeb3(): Promise<boolean> {
    let isWeb3Enabled = false;

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      isWeb3Enabled = true;

      this.accounts = await window.web3.eth.getAccounts();
      console.log(this.accounts, 'accounts');

      this.accountId = this.accounts[0];
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      //alert('No Ethereum provider detected. Check out MetaMask!');
      isWeb3Enabled = false;
    }

    return Promise.resolve(isWeb3Enabled);
  }

  public getAccountId(): Observable<string> {
    let accountId$: Observable<any>;
    
    if (this.accountId == '') {
      accountId$ = from(window.web3.eth.getAccounts()).pipe(
        mergeMap((accounts) => {
          this.accounts = accounts as string[];
          this.accountId = this.accounts[0];
          return of(this.accountId);
        })
      );
    }
    else {
      accountId$ = of(this.accountId);
    }

    return accountId$;
  }

  public getUsdcContract(): Observable<any> {
    let usdc$: Observable<any>;

    if (this.usdcContract == null) {
      const web3 = window.web3;

      usdc$ = from(web3.eth.net.getId()).pipe(
        mergeMap((port: any) => {
          const usdcData = Usdc.networks[port];
          this.usdcContract = new web3.eth.Contract(Usdc.abi, usdcData.address);
          return of(this.usdcContract) 
        })
      )
    }
    else {
      usdc$ = of(this.usdcContract);
    }

    return usdc$;
  }

  public getAbrtContract(): Observable<any> {
    let abrt$: Observable<any>;

    if (this.abrtContract == null) {
      const web3 = window.web3;

      abrt$ = from(web3.eth.net.getId()).pipe(
        mergeMap((port: any) => {
          const abrtData = Abrt.networks[port];
          this.abrtContract = new web3.eth.Contract(Abrt.abi, abrtData.address);
          return of(this.abrtContract) 
        })
      )
    }
    else {
      abrt$ = of(this.abrtContract);
    }

    return abrt$;
  }

  public getAirBankContract(): Observable<any> {
    let airBank$: Observable<any>;

    if (this.airBankContract == null) {
      const web3 = window.web3;

      airBank$ = from(web3.eth.net.getId()).pipe(
        mergeMap((port: any) => {
          const airBankData = AirBank.networks[port];
          this.airBankContract = new web3.eth.Contract(AirBank.abi, airBankData.address);
          return of(this.airBankContract) 
        })
      )
    }
    else {
      airBank$ = of(this.airBankContract);
    }

    return airBank$;
  }

  public getUsdcTotalSupply(): Observable<any> {
    return this.getUsdcContract().pipe(
      mergeMap((usdc: any) => {
        return from(usdc.methods._totalSupply().call()).pipe(
          map(balance => window.web3.utils.fromWei(balance, 'Ether'))
        );
      })
    );
  }

  public getUsdcBalance(accountId: string): Observable<number> {
    return this.getUsdcContract().pipe(
      mergeMap((usdc: any) => {
        return from(usdc.methods._balanceOf(accountId).call()).pipe(
          map(balance => window.web3.utils.fromWei(balance, 'Ether'))
        )
      })
    )
    //let tetherBalance = await tether.methods.balanceOf(this.state.acctNumber).call();
  }

  public stakeTokens(amount: number): Observable<any> {
    const getUsdc$ = this.getUsdcContract();

    getUsdc$.subscribe(usdc => {
      const approve$ = from(usdc.methods.approve(this.airBankContract._address, amount).send({from: this.accountId}));

      approve$.subscribe(() => {
        return from(usdc.methods.depositTokens(amount).send({from: this.accountId}))
      });
    });

    return getUsdc$;
    
    // return this.getUsdcContract().pipe(
    //   mergeMap((usdc: any) => {
    //     from(usdc.methods.approve(this.airBankContract._address, amount).send({from: this.accountId}))
    //   }),
    //   mergeMap((usdc: any) => {
    //     return from(usdc.methods.depositTokens(amount).send({from: this.accountId}))
    //   })
    // )






    // let approve$ = new Observable();

    // approve$ = from(this.usdcContract.methods.approve(this.airBankContract._address, amount).send({from: this.accountId}).on('transactionHash', () => {
    //   this.airBankContract.methods.depositTokens(amount).send({from: this.accountId}).on('transactionHash', (hash: any) => {
    //         console.log('stakeTokens transaction hash:' + hash);
    //     });
    // }))

    // return approve$;



    // this.usdcContract.methods.approve(this.airBankContract._address, amount).send({from: this.accountId}).on('transactionHash', () => {
    //   this.airBankContract.methods.depositTokens(amount).send({from: this.accountId}).on('transactionHash', (hash: any) => {
    //         console.log('stakeTokens transaction hash:' + hash);
    //     });
    // });
  }

  public unstakeTokens() {
    this.airBankContract.methods.unstakeTokens().send({from: this.accountId}).on('transactionHash', (hash: any) => {
      console.log('unstakeTokens transaction hash:' + hash);
    })
  }

  public issueRewards() {
    this.airBankContract.methods.issueTokens().send({from: this.accountId}).on('transactionHash', (hash: any) => {
      console.log('issueRewards transaction hash: ' + hash);
    })
  }
}

// function mergeMap(arg0: (usdc: any) => Observable<unknown>): import("rxjs").OperatorFunction<any, any> {
//   throw new Error('Function not implemented.');
// }
