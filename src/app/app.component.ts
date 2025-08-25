import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Angular Universal</h1>',
  // Explicitly ensuring this component is not standalone
  standalone: false,
})
export class AppComponent {}
