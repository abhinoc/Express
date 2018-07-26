var express = require('express');
var app = express();

// set up handlebars view engine
// var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });

var handlebars = require('express3-handlebars').create({defaultLayout: 'main', 
                                                        helpers: {
                                                            section: function(name, options) {
                                                                if(!this._sections) this._sections = {};
                                                                this._sections[name] = options.fn(this);
                                                                return null;
                                                                }
                                                            }
                                                       });



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var fortune = require('./lib/fortune.js');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));



function getWeatherData(){
    return {
        locations:[
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Overcast',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}


/* app.use(function(){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});
*/
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});



app.get('/', function(req, res){
    res.render('home');
});

if( app.thing === null ) console.log( 'bleat!');

app.get('/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res){
   res.render('tours/hood-river'); 
});


app.get('/tours/oregon-coast', function(req, res){
   res.render('tours/oregon-coast'); 
});


app.get('/tours/request-group-rate', function(req, res){
   res.render('tours/request-group-rate'); 
});



app.get('/headers', function(req,res) {
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

/* Response codes other than 200
app.get('/error', function(req, res) {
    res.status(500);
    res.render('error');
});
*/

/* Passing a context to a view, including querystring, cookie, and session values
app.get('/greeting', function(req, res){
    res.render('about', {
        message: 'welcome',
        style: req.query.style,
        userid: req.cookie.userid,
        username: req.session.username,
    });
});
*/

/* Rendering plaintext output */

app.get('/test', function(req, res){
    res.type('text/plain');
    res.send('this is a test');
});

app.get('/jquery', function(req, res) {
    res.render('jquery-test');
});




// custom 404 page
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost' +
               app.get('port') + '; press Ctrl-c to terminate.');
});

