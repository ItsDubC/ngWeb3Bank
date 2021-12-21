import { Component, OnInit } from '@angular/core';
import { Web3ContractService } from 'src/app/services/web3-contract.service';

@Component({
  selector: 'app-balance-summary',
  templateUrl: './balance-summary.component.html',
  styleUrls: ['./balance-summary.component.scss']
})
export class BalanceSummaryComponent implements OnInit {
  stakedBalance: number = 0;
  rewardBalance: number = 0;

  constructor(
    private web3ContractService: Web3ContractService
  ) { }

  ngOnInit(): void {
    const accountId$ = this.web3ContractService.getAccountId();

    accountId$.subscribe((accountId: string) => {
      this.web3ContractService.getStakedBalance(accountId).subscribe(balance => {
        this.stakedBalance = balance;
      });

      this.web3ContractService.getRewardBalance(accountId).subscribe(balance => {
        this.rewardBalance = balance;
      });
    });

    //this.web3ContractService.loadBalances();
    this.subscribeToBalanceChanges();
  }

  subscribeToBalanceChanges() {
    this.web3ContractService.StakedBalance$.subscribe(result => this.stakedBalance = result);
    this.web3ContractService.RewardBalance$.subscribe(result => this.rewardBalance = result);
  }
}
