import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from 'nativescript-angular/router'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('~/app/pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'new',
    loadChildren: () =>
      import('~/app/pages/new/new.module').then((m) => m.NewModule),
  },
  {
    path: 'note',
    loadChildren: () =>
      import('~/app/pages/note/note.module').then((m) => m.NoteModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('~/app/pages/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
