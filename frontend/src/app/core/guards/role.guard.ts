import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['role'];

    if (this.authService.isAuthenticated()) {
      const user = this.authService.currentUserValue;
      
      if (requiredRole && user?.role !== requiredRole) {
        this.router.navigate(['/dashboard']);
        return false;
      }
      
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
