import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import * as app from 'tns-core-modules/application'
import { Router } from '@angular/router'
import {
  PaceNotesService,
  pnPaceNotesSetsOrder,
  pnPaceNotesSet,
} from '../../services/pacenotes.service'

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private _router: Router
  private _paceNotesService: PaceNotesService

  public paceNotesSets: pnPaceNotesSet[]

  constructor(router: Router, paceNotesService: PaceNotesService) {
    // Use the component constructor to inject providers.
    this._router = router
    this._paceNotesService = paceNotesService
  }

  ngOnInit(): void {
    // Init your component properties here.
    this.paceNotesSets = this._paceNotesService.getPaceNotes(
      pnPaceNotesSetsOrder.A_Z
    )
  }

  onButtonLoad(): void {
    console.log('clicked!')
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView()
    sideDrawer.showDrawer()
  }

  onAdd(): void {
    console.log('clicked add!')
    this._router.navigateByUrl('/new')
  }

  onSort(): void {
    // TODO: show sorting popup
  }

  onSearchClear(): void {
    // TODO: unfilter list
  }

  onSearchSubmit(event): void {
    const searchText = event.object.text
    alert(`you are seartching for ${searchText}`)
    // TODO: filter list
  }
}
