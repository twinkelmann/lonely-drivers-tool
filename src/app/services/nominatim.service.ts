import { Injectable } from '@angular/core'
import * as applicationSettings from 'tns-core-modules/application-settings'
import { DateTime } from 'luxon'
import { pnCoordinates } from './pacenotes.service'

interface pnCachedNominatimLocation {
  location: pnNominatimLocation
  /**
   * ISO date string
   */
  expire: string
}

export interface pnNominatimLocation {
  coordinates: pnCoordinates
  name: string
}

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  private _cachedLocations: { [x: string]: pnCachedNominatimLocation }
  private _NOMINATIM_KEY = 'NOMINATIM_KEY'
  private _nominatimApi =
    'https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0'
  private _cachePrecision = 3
  private _cacheTime = { weeks: 2 }

  constructor() {
    this.init()
    console.log('NominatimService was init')
  }

  public init() {
    this._readFromSettings()
    console.log(
      'loaded',
      Object.keys(this._cachedLocations).length,
      'locations from disk'
    )
  }

  private _readFromSettings() {
    const value = applicationSettings.getString(this._NOMINATIM_KEY, '{}')
    this._cachedLocations = JSON.parse(value)
  }

  private _writeToSettings() {
    applicationSettings.setString(
      this._NOMINATIM_KEY,
      JSON.stringify(this._cachedLocations)
    )
  }

  public async getLocation(
    coordinates: pnCoordinates
  ): Promise<pnNominatimLocation> {
    if (coordinates === null) {
      return {
        coordinates: null,
        name: 'No location',
      }
    }

    const roundedCoordinates: pnCoordinates = [
      parseFloat(coordinates[0].toPrecision(this._cachePrecision)),
      parseFloat(coordinates[1].toPrecision(this._cachePrecision)),
    ]

    // check cache first
    const cacheKey = roundedCoordinates.join(',')
    if (this._cachedLocations.hasOwnProperty(cacheKey)) {
      // update the expire data
      this._cachedLocations[cacheKey].expire = DateTime.local()
        .plus(this._cacheTime)
        .toISO()
      this._writeToSettings()

      console.log('got location from cache')

      return this._cachedLocations[cacheKey].location
    }

    // no cache, get it from the nominatim API
    // docs: https://nominatim.org/release-docs/develop/api/Reverse/

    const url = `${this._nominatimApi}&lat=${roundedCoordinates[0]}&lon=${roundedCoordinates[1]}`
    console.log(url)

    let res: {
      error?: { code: number; message: string }
      display_name: string
    } = null

    try {
      throw 'Not doing requests'
      res = await fetch(url, {
        headers: {
          'User-Agent': "Lonely Driver's Tool; mrbidouille.ch",
        },
      }).then((data) => data.json())
    } catch (e) {
      console.error(e)
      return {
        coordinates: null,
        name: String(e),
      }
    }

    const location: pnNominatimLocation = {
      coordinates: roundedCoordinates,
      name: res.error ? res.error.message : res.display_name,
    }

    // set in cache for next time
    const cacheData: pnCachedNominatimLocation = {
      location,
      expire: DateTime.local().plus(this._cacheTime).toISO(),
    }

    this._cachedLocations[cacheKey] = cacheData
    this._writeToSettings()

    console.log('got location from server')

    return location
  }
}
