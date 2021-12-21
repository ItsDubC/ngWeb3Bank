import { Component, OnInit, ViewChild } from '@angular/core';
import { CountdownConfig, CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { Web3ContractService } from 'src/app/services/web3-contract.service';

@Component({
  selector: 'app-airdrop',
  templateUrl: './airdrop.component.html',
  styleUrls: ['./airdrop.component.scss']
})
export class AirdropComponent implements OnInit {
  @ViewChild('countdown', { static: false }) private countdown!: CountdownComponent;

  countDownConfig: CountdownConfig = { leftTime: 10 };
  stakedBalance: number = 0;

  constructor(
    private web3ContractService: Web3ContractService
  ) { }

  ngOnInit(): void {
    this.countdown.begin(); 
  }

  handleEvent(e: CountdownEvent) {
    console.log(e);

    if (e.action == "done") {
      if (this.stakedBalance > 50000000000000000000) {
        this.web3ContractService.issueRewards();
      }

      this.countdown.restart();
    }
  }

  subscribeToBalanceChanges() {
    this.web3ContractService.StakedBalance$.subscribe(result => this.stakedBalance = result);
  }
}
