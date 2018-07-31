import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertController, NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';
import { AuthService } from "../../providers/auth/auth.service";


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public navCtrl: NavController,
    public userData: UserData
  ) { }

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

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
