import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from 'nativescript-angular/common'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import { PaceNotesSetComponent } from '~/app/components/pace-notes-set.component'

@NgModule({
  imports: [NativeScriptCommonModule, HomeRoutingModule],
  declarations: [HomeComponent, PaceNotesSetComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}
