import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from 'nativescript-angular/common'

import { PaceNotesSetComponent } from './pace-notes-set.component'

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [PaceNotesSetComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PaceNotesSetModule {}
