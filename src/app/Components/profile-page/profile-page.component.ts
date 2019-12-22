import { Component, OnInit } from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RedditDataService } from '../../reddit-data.service';

import * as moment from 'moment';
import { PostsService} from '../../Posts/Posts.service';
import {AuthService} from '../../auth/auth.service';

import {NgForm} from '@angular/forms';

export interface SubType {
  value: string;
  viewValue: string;
}

export interface Time {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private formBuilder: FormBuilder, private getPostsService: PostsService, private redditService: RedditDataService, private getAuthService: AuthService) {
    this.formGroup = formBuilder.group({
      toggleThoseVids: RedditDataService.getEnableVideos(),
      toggleThosePics: RedditDataService.getEnableImages(),
      toggleThatText: RedditDataService.getEnableText(),
      toggleThatSexy: RedditDataService.getAllowNSFW(),
    });
  }

  selectedSubtype: string;
  selectedTime: string;
  onFormSubmit(formValue: any) {
    alert('Your preferences have been saved.');

    console.log(formValue.toggleThoseVids);
    this.redditService.setEnableVideos(formValue.toggleThoseVids);

    console.log(formValue.toggleThosePics);
    this.redditService.setEnableImages(formValue.toggleThosePics);

    console.log(formValue.toggleThatText);
    this.redditService.setEnableText(formValue.toggleThatText);

    console.log(formValue.toggleThatSexy);
    this.redditService.setAllowNSFW(formValue.toggleThatSexy);
  }

  subTypes: SubType[] = [
    {value: '2', viewValue: 'Text'},
    {value: '1', viewValue: 'Image'},
    {value: '3', viewValue: 'Video'},
    {value: '0', viewValue: 'All'}
  ];

  times: Time[] = [
    {value: '1', viewValue: 'Past Day'},
    {value: '7', viewValue: 'Past Week'},
    {value: '30', viewValue: 'Past Month'},
    {value: '0', viewValue: 'All Time'}
  ];


  private swipes: any[];
  private titles: any[] = [];
  private downvoteTitles: any[] = [];


  private username = '';
  title = '';
  public now: Date = new Date();


  ngOnInit() {
    this.getInitialInfo();
  }

  getInitialInfo() {
    let userId = '3';
    if (this.getAuthService.getIsAuth()) {
      userId = this.getAuthService.getUserId();
    }
    this.getPostsService.getSwipes(userId).subscribe(responseData => {
      this.swipes = responseData;

      this.getUserName(userId);
      this.getPostTitles();
    });
  }

  getUserName(UID) {
    this.getAuthService.getUsername(UID).subscribe(responseData => {
      this.username = responseData;
    });
  }


  updateSubType() {
    this.titles = [];
    this.downvoteTitles = [];
    switch (this.selectedSubtype) {
      case '0':
        for (let i = 0; i < this.swipes.length; i++) {
          this.updatePostTitles(i);
        }
        break;
      case '1':
        for (let i = 0; i < this.swipes.length; i++) {
          if (this.swipes[i].SubType === 1) {
            this.updatePostTitles(i);
          }
        }
        break;
      case '2':
        for (let i = 0; i < this.swipes.length; i++) {
          if (this.swipes[i].SubType === 0) {
            this.updatePostTitles(i);
          }
        }
        break;
      case '3':
        for (let i = 0; i < this.swipes.length; i++) {
          if (this.swipes[i].SubType === 2 || this.swipes[i].SubType === 3) {
            this.updatePostTitles(i);
          }
        }
        break;
    }
  }
  updateTime() {
    this.titles = [];
    this.downvoteTitles = [];
    switch (this.selectedTime) {
      case '0':
        for (let i = 0; i < this.swipes.length; i++) {
          this.updatePostTitles(i);
        }
        break;
      case '1':

        for (let i = 0; i < this.swipes.length; i++) {
          const postDate = moment(this.swipes[i].voteTime);
          const now = moment();

          if (postDate > now.subtract(1, 'days')) {
            this.updatePostTitles(i);
          }
        }
        break;
      case '7':
        for (let i = 0; i > this.swipes.length; i++) {
          const postDate = moment(this.swipes[i].voteTime);
          const now = moment();

          if (postDate > now.subtract(168, 'hour')) {
            this.updatePostTitles(i);
          }
        }
        break;
      case '30':
        for (let i = 0; i < this.swipes.length; i++) {
          const postDate = moment(this.swipes[i].voteTime);
          const now = moment();

          if (postDate > now.subtract(30, 'days')) {
            this.updatePostTitles(i);
          }
        }
        break;
    }
  }
  updatePostTitles(index) {
    this.redditService.requestRedditPost(this.swipes[index].postId, response => {
      let post = {
        title: response,
        upvote: this.swipes[index].upvote,
        subType: this.swipes[index].SubType,
        voteTime: this.swipes[index].voteTime
      };




      this.pushToTitle(this.swipes[index].upvote, post);
    });
  }

  pushToTitle(upvote, post) {
    if(upvote === 1) {
      this.titles.push(post);
    } else {
      this.downvoteTitles.push(post);
    }
  }

  getPostTitles() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.swipes.length; i++) {
      if (this.swipes[i].upvote === 1 ) {
        this.redditService.requestRedditPost(this.swipes[i].postId, response => {
          console.log(response);
          let post = {
            title: response,
            upvote: this.swipes[i].upvote,
            subType: this.swipes[i].SubType,
            voteTime: this.swipes[i].voteTime
          };

          this.titles.push(post);
        });
      } else {
        this.redditService.requestRedditPost(this.swipes[i].postId, response => {
          console.log(response);
          let post = {
            title: response,
            upvote: this.swipes[i].upvote,
            subType: this.swipes[i].SubType,
            voteTime: this.swipes[i].voteTime
          };
          this.downvoteTitles.push(post);
        });
      }


    }
  }
  signout(){
    this.getAuthService.logout();
  }



}
