import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedditDataService {

  public static enableLinks: boolean = false;

  constructor() {
    if (localStorage.getItem("enableImages") === null)
    {
      localStorage.setItem("enableImages", "yes");
    }
    if (localStorage.getItem("enableLinks") === null)
    {
      localStorage.setItem("enableLinks", "no");
    }
    if (localStorage.getItem("enableVideos") === null)
    {
      localStorage.setItem("enableVideos", "yes");
    }
    if (localStorage.getItem("enableText") === null)
    {
      localStorage.setItem("enableText", "yes");
    }
    if (localStorage.getItem("allowNSFW") === null)
    {
      localStorage.setItem("allowNSFW", "no");
    }
}

  getNewItem(callback) {
    if (nextItemIdInQueue === 0 || nextItemIdInQueue >= redditData.children.length) {
      requestRedditDataAsync(subreddit, () => {
        nextItemIdInQueue = 0;
        callback(redditData.children[0].data);
        nextItemIdInQueue++;
      });
    } else {
      callback(redditData.children[nextItemIdInQueue].data);
      nextItemIdInQueue++;
    }
  }
  requestRedditPost(id, callback) {

    requestRedditPostAsync(id, () => {
      callback(redditPost);
    });
  }
  // requireFreshData - should be called after changing the post type settings
  requireFreshData()
  {
    nextItemIdInQueue === 0;
  }
  setEnableImages(value : boolean)
  {
    this.requireFreshData();
    localStorage.setItem("enableImages", value ? "yes" : "no");
  }
  setEnableVideos(value)
  {
    this.requireFreshData();
    localStorage.setItem("enableVideos", value ? "yes" : "no");
  }
  setEnableText(value)
  {
    this.requireFreshData();
    // console.log("setting text to: " + value + " (" + (value ? "yes" : "no") + ")")
    localStorage.setItem("enableText", value ? "yes" : "no");
  }
  setAllowNSFW(value)
  {
    this.requireFreshData();
    localStorage.setItem("allowNSFW", value ? "yes" : "no");
  }

  static getEnableImages()
  {
    return localStorage.getItem("enableImages") === "yes";
  }
  static getEnableVideos()
  {
    return localStorage.getItem("enableVideos") === "yes";
  }
  static getEnableText()
  {
    console.log('localStorage: ' + localStorage.getItem("enableText"))
    return localStorage.getItem("enableText") === "yes";
  }
  static getAllowNSFW()
  {
    return localStorage.getItem("allowNSFW") === "yes";
  }
}

let hasItemsInQueue = false;
let nextItemIdInQueue = 0;
const subreddit = 'all';
let redditData = null;
let redditPost: any;
let after = '';

// tslint:disable-next-line:no-shadowed-variable
function requestRedditDataAsync(subreddit, callback) {
    hasItemsInQueue = true;
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        parseRedditData(request.response, callback);
      }

    };
  // tslint:disable-next-line:max-line-length
    request.open( 'GET', 'https://www.reddit.com/r/' + subreddit + '.json?after=' + after + '&limit=100', true); // limit=50 means get 50 posts at a time (instead of the default of 25)
    request.send( null );
}

function requestRedditPostAsync(id, callback) {

  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      parseRedditPost(request.response, callback);
    }

  };
  request.open('GET', 'https://www.reddit.com/' + id + '.json', true);
  request.send(null);

}

function parseRedditPost(response, callback) {
  redditPost = JSON.parse(response)[0].data.children[0].data.title;

  callback(redditPost);
}
function parseRedditData(response, callback) {
      redditData = JSON.parse(response).data;
      after = redditData.after;
      // console.log("Starting length: " + redditData.children.length);
      for (let i = 0; i < redditData.children.length; i++) {
        const post = redditData.children[i].data;
        // console.log(`checking post #${i} - ${post.title}:`)
        // console.log(`post has post_hint "${post.post_hint}" and title: ${post.title}`)
        if (!postMatchesUserPreferences(post)) {
          // console.log(`post #${i} is not link`);
          redditData.children.splice(i, 1); // remove an a post if it doesn't match user preferences
          i--;
        }
      }
      // console.log("Ending length: " + redditData.children.length);
      callback(redditData);
}

function postIsImage(post) {
  return post.post_hint === 'image';
}

function postIsText(post)
{
  return (post.post_hint == undefined && post.selftext != "") || post.post_hint == "self"
}

function postMatchesUserPreferences(post)
{
  if (RedditDataService.getAllowNSFW() == false && post.over_18 == true) {
    return false;
  }
  return  ((RedditDataService.enableLinks && post.post_hint == "link")
    ||    (RedditDataService.getEnableImages() && postIsImage(post))
    ||    (RedditDataService.getEnableVideos() && (post.post_hint == "hosted:video" || post.post_hint == "rich:video"))
    ||    (RedditDataService.getEnableText() && postIsText(post)))
    &&    (post.domain != "gfycat.com");
}
