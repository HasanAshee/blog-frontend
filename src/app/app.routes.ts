import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
import { Home } from './pages/home/home';
import { ArticleForm } from './pages/article-form/article-form';
import { ProfileComponent } from './pages/profile/profile';
import { SettingsComponent } from './pages/settings/settings';
import { ArticleDetail } from './pages/article-detail/article-detail';

export const routes: Routes = [
    {
      path: '',
      component: Home
    },
    {
      path: 'articles/create',
      component: ArticleForm,
      canActivate: [authGuard]
    },
    { path: 'articles/edit/:id',
      component: ArticleForm,
      canActivate: [authGuard] },
    {
      path: 'login',
      component: Login
    },
    {
      path: 'register',
      component: Register
    },
    {
      path: 'profile/:id',
      component: ProfileComponent
    },
    { path: 'settings',
      component: SettingsComponent,
      canActivate: [authGuard],
    },
    {
      path: 'article/:id',
       component: ArticleDetail
    },
];
