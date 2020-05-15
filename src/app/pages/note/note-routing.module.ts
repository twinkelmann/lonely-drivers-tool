import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from 'nativescript-angular/router'

import { NoteComponent } from './note.component'

const routes: Routes = [
  { path: '', component: NoteComponent },
  {
    path: 'record',
    loadChildren: () =>
      import('~/app/pages/record/record.module').then((m) => m.RecordModule),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class NoteRoutingModule {}
