import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { SidebarComponent } from "../../layout/sidebar.component/sidebar.component";
import { HeaderComponent } from "../../layout/header.component/header.component";

@Component({
  selector: 'app-dashboard.component',
  imports: [RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

}
