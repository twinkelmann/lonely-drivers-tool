// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform'
import { keepAwake } from 'nativescript-insomnia'

import { AppModule } from './app/app.module'

platformNativeScriptDynamic().bootstrapModule(AppModule)

keepAwake().then(function () {
  console.log('Insomnia is active')
})
