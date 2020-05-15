import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import * as app from 'tns-core-modules/application'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'Note',
  templateUrl: './note.component.html',
})
export class NoteComponent implements OnInit {
  public activatedroute: ActivatedRoute
  public noteId: number
  private router: Router

  constructor(router: Router) {
    // Use the component constructor to inject providers.
    this.router = router
    this.noteId = -1
  }

  ngOnInit(): void {
    this.activatedroute.data.subscribe((data) => {
      this.noteId = data.noteId
    })
  }

  onHomeButtonTap(): void {
    this.router.navigateByUrl('/home')
  }
}
