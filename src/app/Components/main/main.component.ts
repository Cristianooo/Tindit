import { Component, OnInit } from '@angular/core';
import { RedditDataService } from '../../reddit-data.service';
import {AuthService} from '../../auth/auth.service';
import {PostsService} from '../../Posts/Posts.service';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'hammerjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent implements OnInit {
  postsDisplayed = -1;
  currPost: any;
  card: any;
  cardTransform: any;
  unregisteredswipes = [];
  shouldAskToJoin: boolean = false;

  constructor(private redditDataService: RedditDataService, private authService: AuthService, private postService: PostsService) { }
  ngOnInit() {
    this.currPost = {post_hint: ''};
    this.displayNewItem();
    this.card = document.querySelector('.card');
  }
  swipeRightEnd (element)
 {
   let myCard = document.getElementsByClassName("card-container")[0];
   (myCard as HTMLElement).classList.remove("animate-right");    let myPost = document.getElementsByClassName("card")[0];
   (myPost as HTMLElement).style.visibility = "visible";
 }  swipeLeftEnd (element)
 {
   let myCard = document.getElementsByClassName("card-container")[0];
   (myCard as HTMLElement).classList.remove("animate-left");    let myPost = document.getElementsByClassName("card")[0];
   (myPost as HTMLElement).style.visibility = "visible";
 }

  displayRichVideo() {
    let embedHTML = this.currPost.media.oembed.html; // copy the embed code from the api
    // tslint:disable-next-line:max-line-length
    embedHTML = embedHTML.replace('&lt;', '<').replace('&gt;', '>'); // replace &lt and &gt with the actual < and > characters, respectively.
    document.getElementById('redditPostRichVideo').innerHTML = embedHTML;
  }
  // displayLink ()
  // {
  //   (document.getElementById("redditPostLink") as HTMLIframeElement).src = this.currPost.url;
  // }

  upvotePost(): void {
    let subType;
    switch (this.currPost.post_hint) {
      case 'image':
        subType = 1;
        break;
      case 'hosted:video':
        subType = 2;
        break;
      case 'rich:video':
        subType = 3;
        break;
      case 'link':
        subType = 4;
        break;
      default:
        subType = 0;
        break;
    }

    const Post = {
      postId: this.currPost.id,
      postType: subType
    };
    if (this.authService.getIsAuth()) {
      const userId = this.authService.getUserId();
      this.postService.insertSwipe(userId, Post, true);
    } else {
      this.unregisteredswipes = this.unregisteredswipes.concat({post: Post, upvote: true});
      localStorage.setItem('unregisteredswipes', JSON.stringify(this.unregisteredswipes));
    }

    let myPost = document.getElementsByClassName("card")[0];
   //(myPost as HTMLElement).style.visibility = "hidden";
   this.displayNewItem();
   //SWIPE RIGHT ANIMATION HERE
   let myCard = document.getElementsByClassName("card-container")[0];    //(myCard as HTMLElement).addEventListener("animationend", this.displayNewItem);
   (myCard as HTMLElement).addEventListener("animationend", this.swipeRightEnd);
   (myCard as HTMLElement).classList.add("animate-right");
  }
  downvotePost(): void {
    let subType;
    switch (this.currPost.post_hint) {
      case 'image':
        subType = 1;
        break;
      case 'hosted:video':
        subType = 2;
        break;
      case 'rich:video':
        subType = 3;
        break;
      case 'link':
        subType = 4;
        break;
      default:
        subType = 0;
        break;
    }

    const Post = {
      postId: this.currPost.id,
      postType: subType
    };

    if (this.authService.getIsAuth()) {
      const userId = this.authService.getUserId();
      this.postService.insertSwipe(userId, Post, false);
    } else {
      this.unregisteredswipes = this.unregisteredswipes.concat({post: Post, upvote: false});
      localStorage.setItem('unregisteredswipes', JSON.stringify(this.unregisteredswipes));
    }
    //SWIPE LEFT ANIMATION HERE
   let myPost = document.getElementsByClassName("card")[0];
   //(myPost as HTMLElement).style.visibility = "hidden";
   this.displayNewItem();
   let myCard = document.getElementsByClassName("card-container")[0];
   (myCard as HTMLElement).addEventListener("animationend", this.swipeLeftEnd);
   (myCard as HTMLElement).classList.add("animate-left");
  }

  disableJoinPopup(): void {
    this.shouldAskToJoin = false;
    console.log("hiding join popup");
  }

  displayNewItem(): void {
    this.postsDisplayed = (this.postsDisplayed + 1) % 15
    console.log('' + this.postsDisplayed + ', ' + this.authService.getIsAuth())
    if (this.postsDisplayed == 14 && !this.authService.getIsAuth()) {
      this.shouldAskToJoin = true;
    } else {
      this.shouldAskToJoin = false;
    }
    this.redditDataService.getNewItem(post => {
      // console.log(post); // useful for debug purposes only
      this.currPost = post;
    });
  }

  onSwipeLeft(event)
  {
    this.downvotePost();
  }
  onSwipeRight(event)
  {
    console.log(event);
    this.upvotePost();
  }

}
