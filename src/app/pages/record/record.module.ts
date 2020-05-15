import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from 'nativescript-angular/common'

import { RecordRoutingModule } from './record-routing.module'
import { RecordComponent } from './record.component'

@NgModule({
  imports: [NativeScriptCommonModule, RecordRoutingModule],
  declarations: [RecordComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class RecordModule {}
