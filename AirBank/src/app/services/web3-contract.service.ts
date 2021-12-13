import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import Web3 from 'web3';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3ContractService {
  accounts: string[] = [];
  accountId: string = '';

  private isWeb3EnabledPromise: Promise<boolean>;
  //private isBlockChainDataLoaded: Promise<boolean>;

  constructor() {
    this.isWeb3EnabledPromise = this.loadWeb3().then((result) => {
      return result;
    });
  }

  public isWeb3Enabled() {
    return from(this.isWeb3EnabledPromise);
  }

  //public 






  // //window: any;
  // // private web3: any;
  // // private enable: any;
  //  accounts: string[] = [];
  //  accountId: string = '';
  // hasInitialized = false;


  // theAccountId: Observable<string> = new Observable();



  // constructor() { 
  //   // this.loadWeb3();
  //   // this.loadBlockChainData();
  //   //this.accountId = this.accounts[0];
  //   this.init().then((result) => {
  //     this.hasInitialized = result;
  //   });
  // }

  // public async init(): Promise<any> {
  //   // this.loadWeb3();
  //   // this.loadBlockChainData();
  //   // this.hasInitialized = true;

  //   // this.loadWeb3().then(this.loadBlockChainData().then({

  //   // }));

  //   let hasInitialized = false;

  //   const p1 = this.loadWeb3()
  //     .then((result) => {
  //       return this.loadBlockChainData();
  //     })
  //     .then((result) => {
  //       hasInitialized = true;
  //       console.log('hasInitialized', this.hasInitialized);
  //     })
  //     .catch((result) => {
  //       console.error("Unable to load web3 contracts");
  //     });

  //     return Promise.resolve(hasInitialized);
  // }

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

  // private async loadBlockChainData(): Promise<any> {
  //   const web3 = window.web3;
  //   this.accounts = await web3.eth.getAccounts();
  //   console.log(this.accounts, 'accounts');

  //   this.accountId = this.accounts[0];

  //   //this.theAccountId = 

  //   return Promise.resolve(true);
  // }

  // public getUserAccountId() {
  //   return Observable.
  // }
}


// @Injectable()
// export class Api {
//   private userPromise: Promise<User>;

//   constructor(private http: Http) {
//     this.userPromise = LocalStorage.get('user').then(json => {
//       if (json !== "") {
//         return JSON.parse(json);
//       }
//       return null;
//     });        
//   }

//   public getSomethingFromServer() {
//       return Observable.fromPromise(this.userPromise).flatMap((user) => {
//         return this.http.get(...).map(...);
//       });
//     }
//   }
// }
