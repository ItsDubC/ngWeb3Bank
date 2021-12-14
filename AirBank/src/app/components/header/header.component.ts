import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Web3ContractService } from 'src/app/services/web3-contract.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  accountId: string = '';

  constructor(
    private web3ContractService: Web3ContractService
  ) { }

  ngOnInit(): void {
    //this.accountId = this.web3ContractService.accountId;

    // if (this.web3ContractService.hasInitialized) {
    //   this.accountId = this.web3ContractService.accountId;
    // }
    // else {
    //   alert("Still loading MetaMask integration.");
    // }
    //alert('Is web3 Enabled?' + this.web3ContractService.isWeb3Enabled())
    from(this.web3ContractService.getAccountId()).subscribe(result => {
      this.accountId = result;
    })

    // this.web3ContractService.isWeb3Enabled().subscribe(result => {
    //   alert('web3 enabled:' + result);
    // })
  }

}
