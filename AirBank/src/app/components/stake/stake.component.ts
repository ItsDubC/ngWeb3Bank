import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Web3ContractService } from 'src/app/services/web3-contract.service';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
  providers: [Web3ContractService]
})
export class StakeComponent implements OnInit {
  usdcBalance: number = 0;
  stakeAmount: number = 0;

  constructor(
    private web3ContractService: Web3ContractService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    const accountId$ = this.web3ContractService.getAccountId();

    accountId$.subscribe((accountId: string) => {
      this.web3ContractService.getUsdcBalance(accountId).subscribe(balance => {
        this.usdcBalance = balance;
      });
    });
  }

  stake() {
    if (this.stakeAmount > this.usdcBalance) {
      this.snackBar.open(`Cannot stake more than current balance`, "ERROR", {
        duration: 3000
      });

      return;
    }

    this.web3ContractService.stakeTokens(this.stakeAmount).subscribe(result => {
      this.snackBar.open(`Staked ${this.stakeAmount} mUSDC`, "SUCCESS", {
        duration: 3000
      });
      this.load();
      this.stakeAmount = 0;
    })

    // this.web3ContractService.getAccountId().subscribe(id => {
    //   this.snackBar.open(`Staked ${this.stakeAmount} mUSDC to ${id}`, "SUCCESS", {
    //     duration: 3
    //   });
    // });
  }
}

