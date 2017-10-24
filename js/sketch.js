"use strict";

const TARGET_FRAMERATE = 10
/* let presets = [
    //'assets/xonix_1.png',
    'assets/xonix_3.png',
    'assets/xonix_4.png',
    'assets/xonix_5.png',
    'assets/xonix_6.png',
    'assets/xonix_7.png',
    'assets/xonix_8.png',
    //'/ssets/noisy.jpg',
] */
let img,
	imgs,
	states = []

function preload() {
	imgs = [
		loadImage('assets/xonix_1.png'),
		loadImage('assets/xonix_3.png'),
		loadImage('assets/xonix_4.png'),
		loadImage('assets/xonix_5.png'),
		loadImage('assets/xonix_6.png'),
		loadImage('assets/xonix_7.png'),
		loadImage('assets/xonix_8.png'),
		//loadImage('/assets/noisy.jpg'),
	]
	//img = random(imgs)
	//img = loadImage(random(presets))
	//img = loadImage('/assets/xonix_6.png')
}

function setup() {
	colorMode(RGB, 255, 255, 255, 255)
	//imageMode(CENTER)
	pixelDensity(1)
	//createCanvas(img.width, img.height)
	createCanvas(320, 200)
	img = createVideo(['assets/xonix.mp4'])
	console.log('dimensions:', width, height)
	image(img, 0, 0, img.width, img.height)
	img.loop()
	img.loadPixels()
	// Debug
	frameRate(TARGET_FRAMERATE)
	//noLoop()
}

function draw() {
	clear()
	console.clear()
	console.time("draw loop")
	// Create a new state object
	updatePixels()
	img.loadPixels()
	//console.log(img.pixels)
	states.push(new State(/* img.pixels */))
	console.timeEnd("draw loop")
}

function mousePressed() {
	// Reset everything
	console.clear()
	console.time("reset")
	clear()
	updatePixels()
	// Load a new image
	//img = random(imgs)
	//img = loadImage(random(presets))
	// resizing makes a call to draw, which is a big overhead
	/* resizeCanvas(img.width, img.height); */
	console.log('dimensions:', width, height)
	//image(img, 0, 0, img.width, img.height)
	loadPixels()
	redraw()
	console.timeEnd("reset")
}