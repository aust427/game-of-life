// from 
// wikipedia: https://www.wikiwand.com/en/Conway%27s_Game_of_Life
// and 
// http://web.mit.edu/sp.268/www/2010/lifeSlides.pdf

// once initial set is working, continuous support will 
// be adding a bunch of the random ones lol

// for painting your own patterns
var default_pattern = [
    [1]
];

var erase = [
    [0]
];

// still lifes
var block = [
    [1, 1],
    [1, 1]
];

var beehive = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
];

var loaf = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
];

var boat = [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
];

var tub = [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
];

// oscillators (initial shape)
// period 2 
var blinker = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
]; 

var toad = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
];

var beacon = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1]
];

// period 3 
var pulsar = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// spaceships (initial shape)
glider = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
];

// light-weight spaceship
LWSS = [
    [0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
];

// medium-weight spaceship
MWSS = [
    [0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0]
];

// heavy-weight spaceship
HWSS = [
    [0, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0]
];

var cell_dict = {'freehand': 0, 'still life': 0, 'oscillators': 0, 'spaceships': 0}