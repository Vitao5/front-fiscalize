import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-page-not-found',
  imports: [SidebarComponent],
  standalone: true,
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {

}
