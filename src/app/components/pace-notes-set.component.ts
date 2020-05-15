import { Component, OnInit, Input } from '@angular/core'
import * as app from 'tns-core-modules/application'
import { Router } from '@angular/router'
import { pnPaceNotesSet } from '../services/pacenotes.service'

@Component({
  selector: 'PaceNotesSet',
  templateUrl: './pace-notes-set.component.html',
})
export class PaceNotesSetComponent implements OnInit {
  @Input()
  public paceNotesSet: pnPaceNotesSet

  constructor() {}

  ngOnInit(): void {}
}
