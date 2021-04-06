import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss']
})
export class NavToolbarComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter();
  @Output() logout = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onToggleSideNav() {
    this.toggleSideNav.emit();
  }

  public onLogout() {
      this.logout.emit();
  }


}
