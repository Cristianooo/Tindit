let hasItemsInQueue = false;
let nextItemIdInQueue = 0;
let subreddit = "all";
let redditData = null;
let after = "";

function requestRedditDataAsync(subreddit, callbackAfterDataIsParsed)
{
    hasItemsInQueue = true;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200)
      {
        parseRedditData(request.response, callbackAfterDataIsParsed);
      }
    }
    request.open( "GET", "https://www.reddit.com/r/" + subreddit + ".json?after=" + after, true);
    request.send( null );
}

function parseRedditData(response, callbackAfterDataIsParsed) {
      redditData = JSON.parse(response).data
      after = redditData.after
      // console.log(redditData.children[0])
      callbackAfterDataIsParsed()
}

function getNewItem()
{
  if (nextItemIdInQueue == 0 || nextItemIdInQueue >= redditData.children.length) // need to pull new items from reddit
  {
    requestRedditDataAsync(subreddit, () =>
    {
      displayItemById(0)
      nextItemIdInQueue = 0;
    });
  } else
  {
    displayItemById(nextItemIdInQueue)
  }
  nextItemIdInQueue++;
}

function displayItemById(id)
{
  document.getElementById("embeddedPost").innerHTML = '<blockquote class="reddit-card" data-card-created="1569221735"><a href="https://www.reddit.com' + redditData.children[id].data.permalink + '"></a></blockquote>'
}
