# Integration of Google Firebase

a) Install the npm packages "firebase" and "angularfire2" with the command:
```
npm install firebase@5.0.4 --save
npm install angularfire2@5.0.0-rc.10 --save
```
b) Create the folder "/src/environment/".
c) Create the file "environment.ts" in the folder "/src/environment/":
```js
export const environment = {
  production: false,
  firebase: {
      apiKey:             "yourApiKey",
      authDomain:         "domain.firebaseapp.com",
      databaseURL:        "https://domain.firebaseio.com",
      storageBucket:      "domain.appspot.com",
      messagingSenderId:  "yourSenderId"
  }
};
```
d) Create the file "environment.prod.ts" in the folder "/src/environment/":
```js
export const environment = {
  production: true,
  firebase: {
      apiKey:             "yourApiKey",
      authDomain:         "domain.firebaseapp.com",
      databaseURL:        "https://domain.firebaseio.com",
      storageBucket:      "domain.appspot.com",
      messagingSenderId:  "yourSenderId"
  }
};
```
e) Create the folder "/src/providers/auth/".
f) Add the AngularFireModules to the file "app.module.ts":
```js
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ...
  ]
```
g) Create the file "auth.service.ts" in the folder "/src/providers/auth/":
```js
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
// Firebase:
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthService {
  
    constructor(
        private angularFireAuth: AngularFireAuth
    ) {}

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
}
```
h) Add the AuthService to the file "app.module.ts":
```js
  providers: [
    AuthService,
    ...
  ]
```
i) Add the AuthService and the AlertController to the file "/src/pages/login/login.ts":
```js
  import { AlertController, ... } from 'ionic-angular';
  import { AuthService } from "../../providers/auth/auth.service";

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    ...
  ) { }
```
j) Change the function "onLogin()" in the file "/src/pages/login/login.ts":
 ```js   
   onLogin(form: NgForm) {
     this.submitted = true;
 
     if (form.valid) {
       this.authService.login(this.login.username, this.login.password).subscribe(
         () => {
           this.userData.login(this.login.username);
 
           let confirm = this.alertCtrl.create({
             title: 'Login successful',
             buttons: [
               {
                 text: 'OK',
                 handler: () => {
                   // Open TabsPage:
                   this.navCtrl.push(TabsPage);
                 }
               }
             ]
           });
           confirm.present();
         },
         (error: any) => {
           console.error(error);
 
           let confirm = this.alertCtrl.create({
             title: 'Login failed',
             subTitle: 'Something went wrong.',
             buttons: [
               {
                 text: 'OK'
               }
             ]
           });
           confirm.present();
         }
       );
     }
   }
 ```
