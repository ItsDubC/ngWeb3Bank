import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3ContractService {
  //window: any;
  // private web3: any;
  // private enable: any;
  accounts: string[] = [];
  accountId: string = '';

  constructor() { 
    this.loadWeb3();
    this.loadBlockChainData();
    //this.accountId = this.accounts[0];
  }

  private async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      alert('No Ethereum provider detected. Check out MetaMask!');
    }
  }

  private async loadBlockChainData() {
    const web3 = window.web3;
    this.accounts = await web3.eth.getAccounts();
    console.log(this.accounts, 'accounts');

    this.accountId = this.accounts[0];
  }
}
