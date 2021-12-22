import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CountdownConfig, CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { Web3ContractService } from 'src/app/services/web3-contract.service';

@Component({
  selector: 'app-airdrop',
  templateUrl: './airdrop.component.html',
  styleUrls: ['./airdrop.component.scss']
})
export class AirdropComponent implements OnInit, AfterViewInit {
  @ViewChild('countdown', { static: false }) private countdown!: CountdownComponent;

  countDownConfig: CountdownConfig = { leftTime: 10 };
  stakedBalance: number = 0;

  constructor(
    private web3ContractService: Web3ContractService
  ) { }

  ngOnInit(): void {
    this.load();
    this.subscribeToBalanceChanges();
  }

  ngAfterViewInit(): void {
    this.countdown.begin(); 
  }

  load() {
    const accountId$ = this.web3ContractService.getAccountId();

    accountId$.subscribe((accountId: string) => {
      this.web3ContractService.getStakedBalance(accountId).subscribe(balance => {
        this.stakedBalance = balance;
      });
    });
  }

  handleEvent(e: CountdownEvent) {
    console.log(e, this.stakedBalance);

    if (e.action == "done") {
      if (+this.stakedBalance > 50) {
        //this.web3ContractService.issueRewardTokens();
      }

      this.countdown.restart();
    }
  }

  subscribeToBalanceChanges() {
    this.web3ContractService.StakedBalance$.subscribe(result => this.stakedBalance = +result);
  }

  issueRewards() {
    this.web3ContractService.issueRewardTokens();
  }
}
