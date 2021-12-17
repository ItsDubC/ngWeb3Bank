import { Component, OnInit } from '@angular/core';
import { Web3ContractService } from 'src/app/services/web3-contract.service';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent implements OnInit {
  usdcBalance: number = 0;

  constructor(
    private web3ContractService: Web3ContractService
  ) { }

  ngOnInit(): void {
    const accountId$ = this.web3ContractService.getAccountId();

    accountId$.subscribe((accountId: string) => {
      this.web3ContractService.getUsdcBalance(accountId).subscribe(balance => {
        this.usdcBalance = balance;
      })
    })
  }
}
