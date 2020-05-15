import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import * as app from 'tns-core-modules/application'
import { Location } from '@angular/common'

@Component({
  selector: 'New',
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit {
  private _location: Location

  constructor(location: Location) {
    // Use the component constructor to inject providers.
    this._location = location
  }

  ngOnInit(): void {
    // Init your component properties here.
  }

  onBackButtonTap(): void {
    this._location.back()
  }
}
