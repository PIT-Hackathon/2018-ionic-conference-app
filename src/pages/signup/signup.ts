import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertController, NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { AuthService } from "../../providers/auth/auth.service";


@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public navCtrl: NavController,
    public userData: UserData
  ) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      // this.userData.signup(this.signup.username);
      // this.navCtrl.push(TabsPage);

      this.authService.createUser(this.signup.username, this.signup.password).subscribe(
        () => {

          this.userData.signup(this.signup.username);

          let confirm = this.alertCtrl.create({
            title: 'Register successful',
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
        (error) => {
            console.error(error);

          let confirm = this.alertCtrl.create({
            title: 'Register failed',
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
}
