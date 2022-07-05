import { Component, OnInit, Input } from '@angular/core'
import * as app from 'tns-core-modules/application'
import { Router } from '@angular/router'
import {
  pnPaceNotesSet,
  PaceNotesSetsUtils,
} from '../services/pacenotes.service'
import { NominatimService } from '../services/nominatim.service'

@Component({
  selector: 'PaceNotesSet',
  templateUrl: './pace-notes-set.component.html',
})
export class PaceNotesSetComponent implements OnInit {
  @Input()
  public paceNotesSet: pnPaceNotesSet

  public nominatimService: NominatimService

  public locationName: string = 'Unknown'
  public numNotes: number = 0
  public numKm: number = 0

  constructor(nominatimService: NominatimService) {
    this.nominatimService = nominatimService
  }

  ngOnInit(): void {
    // setup computed values
    this.nominatimService
      .getLocation(PaceNotesSetsUtils.coordinates(this.paceNotesSet))
      .then((data) => {
        this.locationName = data.name
      })
    this.numNotes = this.paceNotesSet.notes.length
    this.numKm = PaceNotesSetsUtils.distance(this.paceNotesSet)
  }
}
