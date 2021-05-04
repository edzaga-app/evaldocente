import { Route, Router } from '@angular/router';

export interface NavRoute extends Route {
  path?: string;
  icon?: string;
  group?: string;
  groupedNavRoutes?: NavRoute[];
}

export const sideNavPath = 'app';

export const navRoutes: NavRoute[] = [
  {
    data: {  title: 'Evaldocente' },
    icon: 'table_chart',
    path: 'inicio/:token',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
          m => m.HomePageModule,
      ),
  },
  {
    path: 'consolidadohetero',
    loadChildren: () => 
      import('./pages/consolidated-report/consolidated-report.module').then(
        m => m.ConsolidatedReportModule
      ),
  },
  {
      path: '',
      redirectTo: 'inicio/:token',
      pathMatch: 'full',
  },
];
