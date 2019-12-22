import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatFormField} from '@angular/material';
import {PostsService} from '../../Posts/Posts.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private postService: PostsService) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.createUser(form.value.email, form.value.username, form.value.password).subscribe(response => {
      console.log(response);
      // this.authService.get
      // const unAuthSwipes = JSON.parse(localStorage.getItem('unregisteredswipes'));
      // if (unAuthSwipes != null) {
      //   for (const swipe of unAuthSwipes) {
      //     this.postService.insertSwipe(this.userId, swipe.post, swipe.upvote);
      //   }
      // }
      this.router.navigate(['/login']);
    });
  }
}



