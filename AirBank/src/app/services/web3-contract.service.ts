import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
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
    let accounts$: Observable<any>;
    
    if (this.accountId == '') {
      accounts$ = from(window.web3.eth.getAccounts());

      accounts$.subscribe((result) => {
        this.accounts = result as string[];
        this.accountId = this.accounts[0];
      });
    }
    else {
      accounts$ = of(this.accountId);
    }

    return accounts$;
  }

  public getUsdcContract(): Observable<any> {
    let usdc$: Observable<any>;

    if (this.usdcContract == null) {
      const web3 = window.web3;
      usdc$ = from(web3.eth.net.getId());

      usdc$.subscribe((result) => {
        const usdcData = Usdc.networks[result];

        if (usdcData) {
          this.usdcContract = new web3.eth.Contract(Usdc.abi, usdcData.address);
        }
      })
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
      abrt$ = from(web3.eth.net.getId());

      abrt$.subscribe((result) => {
        const abrtData = Abrt.networks[result];

        if (abrtData) {
          this.abrtContract = new web3.eth.Contract(Abrt.abi, abrtData.address);
        }
      })
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
      airBank$ = from(web3.eth.net.getId());

      airBank$.subscribe((result) => {
        const airBankData = AirBank.networks[result];

        if (airBankData) {
          this.airBankContract = new web3.eth.Contract(AirBank.abi, airBankData.address);
        }
      })
    }
    else {
      airBank$ = of(this.abrtContract);
    }

    return airBank$;
  }

  public stakeTokens(amount: number) {
    const approve$ = new Observable();






    
    this.usdcContract.methods.approve(this.airBankContract._address, amount).send({from: this.accountId}).on('transactionHash', () => {
      this.airBankContract.methods.depositTokens(amount).send({from: this.accountId}).on('transactionHash', (hash: any) => {
            console.log('stakeTokens transaction hash:' + hash);
        });
    });
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