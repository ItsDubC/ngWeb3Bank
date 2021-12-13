import { Component, OnInit } from '@angular/core';
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
    this.accountId = this.web3ContractService.accountId;
  }

}
