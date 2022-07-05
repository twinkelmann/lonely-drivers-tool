import { Injectable } from '@angular/core'
import { DateTime } from 'luxon'
import * as applicationSettings from 'tns-core-modules/application-settings'

/**
 * lat, long
 */
export type pnCoordinates = [number, number]

export interface pnTime {
  /**
   * Time in milliseconds
   */
  value: number
  /**
   * UTC ISO String
   */
  date: string
  /**
   * Version of the pace notes when time was recorded
   */
  version: number
}

export interface pnNote {
  /**
   * The textual value of the pace note
   */
  value: string
  /**
   * Wether this not should be called right after the previous
   */
  callAfterPrevious: boolean
  /**
   * If callAfterPrevious is false, how many meters before the coordinates should it be called
   */
  callDistance: number
  /**
   * Coordinates of the pace note
   */
  coordinates: pnCoordinates
}

export interface pnPaceNotesSet {
  /**
   * Version number incremented when changes are made to the notes
   */
  version: number
  /**
   * UTC ISO String
   */
  createdAt: string
  /**
   * Name of the pace notes (can be auto generated)
   */
  name: string
  /**
   * Description of the pace notes (optional)
   */
  description?: string
  /**
   * Language used to listen for and play back pace notes. Only french and english supported for now
   */
  language: 'en' | 'fr'
  /**
   * User defined difficulty level from 0 (easy) to 2 (hard)
   */
  difficulty: 0 | 1 | 2
  /**
   * Default call distance in meters for new pace notes
   */
  defaultCallDistance: number
  /**
   * List of all pace notes
   */
  notes: pnNote[]
  /**
   * List of all recorded times
   */
  times: pnTime[]
}

export enum pnPaceNotesSetsOrder {
  A_Z,
  LATEST_CREATED,
  CLOSEST_GPS,
  MOST_PACE_NOTES,
  LONGEST_DISTANCE,
  MOST_DIFFICULT,
}

const PI_OVER_180 = Math.PI / 180

function degreeToRadians(degrees) {
  return degrees * PI_OVER_180
}

/**
 * Calculates the distance in km between two cardinal points (from https://www.npmjs.com/package/distance-from)
 */
function distanceInKm(coords1: pnCoordinates, coords2: pnCoordinates) {
  if (coords1 === null || coords2 === null) {
    return Infinity
  }

  const sine = (num) => Math.sin(num / 2)
  const cos = (num) => Math.cos(num)
  const radius = 6371
  const φ1 = degreeToRadians(coords1[0])
  const λ1 = degreeToRadians(coords1[1])
  const φ2 = degreeToRadians(coords2[0])
  const λ2 = degreeToRadians(coords2[1])
  const Δφ = φ2 - φ1
  const Δλ = λ2 - λ1
  const a = sine(Δφ) * sine(Δφ) + cos(φ1) * cos(φ2) * Math.pow(sine(Δλ), 2)
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * radius
}

export class PaceNotesSetsUtils {
  /**
   * Get the pace note's starting coordinates
   * @returns null if the pace notes don't have any notes
   */
  static coordinates(paceNotesSet: pnPaceNotesSet) {
    return paceNotesSet.notes.length > 0
      ? paceNotesSet.notes[0].coordinates
      : null
  }

  /**
   * Get the total approximate distance of a set of pace notes
   */
  static distance(paceNotesSet: pnPaceNotesSet) {
    let distance = 0

    for (let i = 0; i < paceNotesSet.notes.length - 1; ++i) {
      distance += distanceInKm(
        paceNotesSet.notes[i].coordinates,
        paceNotesSet.notes[i + 1].coordinates
      )
    }

    return parseFloat(distance.toPrecision(1))
  }

  static timesBest(paceNotesSet: pnPaceNotesSet) {
    return [...paceNotesSet.times].sort((a, b) => a.value - b.value)
  }

  static timesCurrentBest(paceNotesSet: pnPaceNotesSet) {
    const currentTimes: pnTime[] = []
    const oldTimes: pnTime[] = []

    paceNotesSet.times.forEach((time) =>
      time.version === paceNotesSet.version
        ? currentTimes.push(time)
        : oldTimes.push(time)
    )

    currentTimes.sort((a, b) => a.value - b.value)
    oldTimes.sort((a, b) => a.value - b.value)

    return currentTimes.concat(oldTimes)
  }

  static timesMostRecent(paceNotesSet: pnPaceNotesSet) {
    return [...paceNotesSet.times].sort(
      (a, b) =>
        DateTime.fromISO(a.date).toMillis() -
        DateTime.fromISO(b.date).toMillis()
    )
  }

  static timesOldest(paceNotesSet: pnPaceNotesSet) {
    return [...paceNotesSet.times].sort(
      (a, b) =>
        DateTime.fromISO(b.date).toMillis() -
        DateTime.fromISO(a.date).toMillis()
    )
  }

  static paceNotesSetsAZ(paceNotesSets: pnPaceNotesSet[]) {
    return [...paceNotesSets].sort((a, b) => a.name.localeCompare(b.name))
  }

  static paceNotesSetsLatest(paceNotesSets: pnPaceNotesSet[]) {
    return [...paceNotesSets].sort(
      (a, b) =>
        DateTime.fromISO(a.createdAt).toMillis() -
        DateTime.fromISO(b.createdAt).toMillis()
    )
  }

  static paceNotesSetsClosest(
    paceNotesSets: pnPaceNotesSet[],
    reference: pnCoordinates
  ) {
    const distances: [pnPaceNotesSet, number][] = paceNotesSets.map((set) => [
      set,
      distanceInKm(reference, PaceNotesSetsUtils.coordinates(set)),
    ])

    return distances.sort((a, b) => a[1] - b[1]).map((array) => array[0])
  }

  static paceNotesSetsMostNotes(paceNotesSets: pnPaceNotesSet[]) {
    return [...paceNotesSets].sort((a, b) => a.notes.length - b.notes.length)
  }

  static paceNotesSetsLongestDistance(paceNotesSets: pnPaceNotesSet[]) {
    const distances: [pnPaceNotesSet, number][] = paceNotesSets.map((set) => [
      set,
      PaceNotesSetsUtils.distance(set),
    ])

    return distances.sort((a, b) => b[1] - a[1]).map((array) => array[0])
  }

  static paceNotesSetsMostDifficult(paceNotesSets: pnPaceNotesSet[]) {
    return [...paceNotesSets].sort((a, b) => a.difficulty - b.difficulty)
  }
}

@Injectable({
  providedIn: 'root',
})
export class PaceNotesService {
  private _paceNotesSets: pnPaceNotesSet[] = []
  private _PACE_NOTES_SETS_KEY = 'PACE_NOTES_SETS_KEY'

  constructor() {
    this.init()
    console.log('PaceNotesService was init')
  }

  public init() {
    this._readFromSettings()

    console.log('loaded', this._paceNotesSets.length, 'pace notes from disk')

    if (this._paceNotesSets.length === 0) {
      this._seed()
      this._writeToSettings()
    }
  }

  public getPaceNotes(order: pnPaceNotesSetsOrder, reference?: pnCoordinates) {
    switch (order) {
      case pnPaceNotesSetsOrder.A_Z:
        return PaceNotesSetsUtils.paceNotesSetsAZ(this._paceNotesSets)
      case pnPaceNotesSetsOrder.LATEST_CREATED:
        return PaceNotesSetsUtils.paceNotesSetsLatest(this._paceNotesSets)
      case pnPaceNotesSetsOrder.CLOSEST_GPS:
        return PaceNotesSetsUtils.paceNotesSetsClosest(
          this._paceNotesSets,
          reference
        )
      case pnPaceNotesSetsOrder.MOST_PACE_NOTES:
        return PaceNotesSetsUtils.paceNotesSetsMostNotes(this._paceNotesSets)
      case pnPaceNotesSetsOrder.LONGEST_DISTANCE:
        return PaceNotesSetsUtils.paceNotesSetsLongestDistance(
          this._paceNotesSets
        )
      case pnPaceNotesSetsOrder.MOST_DIFFICULT:
        return PaceNotesSetsUtils.paceNotesSetsMostDifficult(
          this._paceNotesSets
        )
    }
  }

  private _readFromSettings() {
    const value = applicationSettings.getString(this._PACE_NOTES_SETS_KEY, '[]')
    this._paceNotesSets = JSON.parse(value)
  }

  private _writeToSettings() {
    applicationSettings.setString(
      this._PACE_NOTES_SETS_KEY,
      JSON.stringify(this._paceNotesSets)
    )
  }

  private _seed() {
    this._paceNotesSets = [
      {
        version: 0,
        createdAt: 'not a date',
        name: 'Test n°1',
        description: 'This is the description',
        language: 'en',
        difficulty: 0,
        defaultCallDistance: 50,
        notes: [],
        times: [],
      },
      {
        version: 1,
        createdAt: 'not a date',
        name: 'I am another test',
        language: 'fr',
        difficulty: 2,
        defaultCallDistance: 50,
        notes: [
          {
            value: 'left 4 opens',
            callAfterPrevious: false,
            callDistance: 50,
            coordinates: [47.3857, 7.2022],
          },
          {
            value: 'into right 3 extra long',
            callAfterPrevious: false,
            callDistance: 50,
            coordinates: [47.3885, 7.20105],
          },
          {
            value: 'opens 100',
            callAfterPrevious: false,
            callDistance: 50,
            coordinates: [47.38887, 7.20272],
          },
          {
            value: 'braking into left hairpin late',
            callAfterPrevious: false,
            callDistance: 50,
            coordinates: [47.38898, 7.20371],
          },
          {
            value: '50',
            callAfterPrevious: true,
            callDistance: 50,
            coordinates: [47.38938, 7.20328],
          },
        ],
        times: [
          {
            value: 65572,
            date: 'not a date',
            version: 0,
          },
          {
            value: 63572,
            date: 'not a date',
            version: 1,
          },
          {
            value: 63642,
            date: 'not a date',
            version: 1,
          },
        ],
      },
    ]
  }
}
