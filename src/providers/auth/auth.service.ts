import {Injectable} from '@angular/core';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
// Firebase:
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserInfo} from './user.info';

@Injectable()
export class AuthService {

    static UNKNOWN_USER = {
        isAnonymous: true,
        email: null,
        displayName: null,
        providerId: null,
        uid: null
    };

    userInfo = new BehaviorSubject<UserInfo>(AuthService.UNKNOWN_USER);
    private user: firebase.User;

    constructor(
        private angularFireAuth: AngularFireAuth
    ) {
        this.angularFireAuth.authState.subscribe((user) => {
            console.log(`user:`, JSON.stringify(user));

            this.user = user;
            const userInfo = new UserInfo();
            if (user != null) {
                userInfo.isAnonymous = user.isAnonymous;
                userInfo.email = user.email;
                userInfo.displayName = user.displayName;
                userInfo.providerId = user.providerId;
                userInfo.photoURL = user.photoURL;
                userInfo.uid = user.uid;
            } else {
                this.user = null;
                userInfo.isAnonymous = true;
            }
            this.userInfo.next(userInfo);
        });
    }

    login(email: string, password: string): Observable<string> {
        console.log('class AuthService: login(email: string, password: string): Observable');

        const result = new Subject<string>();
        this.angularFireAuth.auth.signInWithEmailAndPassword(email, password).then(() => {
            result.next('success');
        }).catch((error) => {
            result.error(error)
        });

        return result.asObservable();
    }

    currentUser(): Observable<UserInfo> {
        return this.userInfo.asObservable();
    }

    logout(): Observable<string> {
        const result = new Subject<string>();
        this.userInfo.next(AuthService.UNKNOWN_USER);

        this.angularFireAuth.auth.signOut().then(() => {
            result.next('success');
        }).catch((error) => {
            result.error(error)
        });

        return result.asObservable();
    }

    isLoggedIn(): Observable<boolean> {
        return this.userInfo.pipe(map(userInfo => !userInfo.isAnonymous));
    }
}
