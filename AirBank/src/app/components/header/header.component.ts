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
    from(this.web3ContractService.getAccountId()).subscribe(result => {
      this.accountId = result;
    })

    // this.web3ContractService.getUsdcTotalSupply().subscribe(result => {
    //   alert(result + ' mUSDC');
    // })
  }
}
