var request = require('request');

// Dependencies ===============================
var
twit = require('twit'),
config = require('./config');

var Twitter = new twit(config);


const hashtag = function () {
    console.log("body");
    const needle = require('needle');

    const token = process.env.TWITTER_Bearer_TOKEN;

    const endpointUrl = 'https://api.twitter.com/2/tweets/search/all'

    async function getRequest() {

        const params = {
            'query': 'from:twitterdev -is:retweet',
            'tweet.fields': 'author_id'
        }

        const res = await needle('get', endpointUrl, params, {
            headers: {
                "User-Agent": "v2FullArchiveJS",
                "authorization": `Bearer ${token}`
            }
        })

        if (res.body) {
            return res.body;
        } else {
            throw new Error('Unsuccessful request');
        }
    }

    (async () => {

        try {
            // Make request
            const response = await getRequest();
            console.dir(response, {
                depth: null
            });

        } catch (e) {
            console.log(e);
            process.exit(-1);
        }
        process.exit();
    })();
}

const LikeESTIAM = function () {
    
var favoriteTweet = function(){
    var params = {
        q: '#ESTIAM, #estiam', 
        result_type: 'recent',
        lang: 'fr'
    }
    
    Twitter.get('search/tweets', params, function(err,data){
  
      // find tweets
      var tweet = data.statuses;
      var randomTweet = ranDom(tweet); 
      if(typeof randomTweet != 'undefined'){
          
        Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
            
          if(err){
            console.log('CANNOT BE FAVORITE... Error');
          }
          else{
            console.log('FAVORITED... Success!!!');
          }
        });
      }
    });
  }
  favoriteTweet();
  setInterval(favoriteTweet, 3600000);
  
  function ranDom (arr) {
    if (arr !== undefined) {
        var index = Math.floor(Math.random()*arr.length);
        return arr[index];
    }
  };
}

const retweetESTIAM = function () {
    var params = {
        q: '#ESTIAM, #estiam', 
        result_type: 'recent',
        lang: 'fr'
    }
    
    Twitter.get('search/tweets', params, function(err,data){
  
    }).then ((response) => {
        if (response.statuses) {
            response.statuses.forEach((status) => {
                Twitter.tweets.statusesRetweetById({
                    id: status.id_str
                })
                .then ((resp) => console.log(`Retweeted tweet #${status.id}`))
                .catch ((err) => console.error(err))
            })
        }
    }).catch ((err) => console.error(err))
}
module.exports = {
    hashtag,LikeESTIAM,retweetESTIAM
}
