import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from 'nativescript-angular/common'

import { NoteRoutingModule } from './note-routing.module'
import { NoteComponent } from './note.component'

@NgModule({
  imports: [NativeScriptCommonModule, NoteRoutingModule],
  declarations: [NoteComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NoteModule {}
