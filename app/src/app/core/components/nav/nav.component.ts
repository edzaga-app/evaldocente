import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  className = 'NavComponent';
  isOpen = true;
  token: string;
  tokenValidate = false;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService) {
    this.token = activatedRoute?.snapshot?.firstChild?.params?.token;
    this.tokenValidate = this.initializedSettings();
  }

  ngOnInit(): void {
  }

  initializedSettings(): boolean {
    let res = false;
    try {
      const urlSegment = window.location.href.split('/');
      const indexUrl = urlSegment.length;

      if (indexUrl <= 0) return res; 
      const urlToken = urlSegment[indexUrl - 1];

      if (this.token !== urlToken) return res;
      window.history.replaceState(null, null, window.location.href.replace(`/${this.token}`, ''));
      this.authService.auth(this.token);
      res = true;

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }



  public toggleSideNav() {
    this.isOpen = !this.isOpen;
  }

  public getNavigationItems(): any {
    //return this.navigationService.getNavigationItems();
  }

  public getActivePage(): any {
    //return this.navigationService.getActivePage();
  }

  public logout() {
    // this.authService.logout();
    // this.router.navigate(['login'], { replaceUrl: true });
  }

  public getPreviousUrl(): any {
    // return this.navigationService.getPreviousUrl();
  }

}
