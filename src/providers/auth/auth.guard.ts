import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard {

    constructor(
        private authService: AuthService
    ) {}

    canActivate(): Observable<boolean> {
        return this.authService.isLoggedIn();
    }
}
