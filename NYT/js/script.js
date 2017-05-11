function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
        address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // load nytimes
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
        cityStr + "&sort=newest&api-key=121186976b724760bba55aa8857ce99c"
    $.getJSON(nytimesUrl, function(data) {
        console.log(data);
        $nytHeaderElem.text('New York Times Article About ' + cityStr);


        articles = data.response.docs;
        console.log(articles.length);
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' +
                article.headline.main + '</a>' + '<p>' + article.snippet +
                '</p>' + '</li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text('NewYork Times Article Cannot be loaded')
    })
    //Wikipedia AJAX request goes here
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
        cityStr + '&format=json&callback=wkiaCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    },8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);