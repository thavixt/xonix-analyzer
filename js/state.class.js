"use strict";
/**
 * Cut off the insignificant data
 * The offset from the bottom at 320x200 resolution
 */
const OFFSET_H = 0.915 // 8
/**
 * The offset from the right at 320x200 resolution
 */
const OFFSET_W = 0.9 // 20
/**
 * Alert distance between the line and a flying point
 */
const ALERT_RADIUS = 40
/**
 * Color values:
 * wall color: green - #00a8a8 - [0, 168, 168, 255]
 * empty color: black - #000000 - [0, 0, 0, 255]
 * current line: purple - #a800a8 - [168, 0, 168, 255]
 * floating point borders: grey - #a800a8 - [168, 168, 168, 255]
 */
const WALL = [0, 168, 168]
const EMPTY = [0, 0, 0]
const LINE = [168, 0, 168]
const POINT = [168, 168, 168]
/**
 * Color range - precision to determine elements
 * based on their RGB(A) values
 * (color +- COLOR_RANGE should yield a match)
 */
const COLOR_RANGE = 80
/**
 * Spread range
 * TODO: explain
*/
const SPREAD = 100

class State {

	constructor(/* rawPixels */) {
		console.time("instance creation")
		//this.raw = rawPixels
		this.width = img.width * OFFSET_W
		this.height = img.height * OFFSET_H
		this.time = new Date().getTime()
		this.pixels = [] // all pixels of the state
		this.player = [] // positions of the player
		this.walls = [] // wall pixels - green
		this.points = [] // floating points - grey+green
		this.line = [] // line pixels - purple
		//this.lineSignificant = [] // significant part of the line
		this.empty = 0; // empty space pixels - black
		this.unknown = 0; // unknown pixels - should be 0!
		this.load()
		this.log()
		console.timeEnd("instance creation")
		// These are for debugging / development / testing
		/* clear()
		background(255) */
		//this.colorize(this.walls, [100, 100, 100, 255])
		//this.colorize(this.player, [0, 255, 0, 255])
		this.emphasize(this.line, this.walls)
		this.colorize(this.points, [168, 0, 168, 255])
		this.colorize(this.line, [0, 0, 255, 255])
		//this.draw()
	}

    /**
     * Draw the state - unnecessary
     */
	draw() {
		clear()
		for (var w = 0; w < this.width; w++) {
			for (var h = 0; h < this.height; h++) {
				stroke(...this.pixels[w][h])
				point(w, h)
			}
		}
	}

    /**
     * Load the pixels into a 2D [r,g,b,a] array and
     * determine what kind of elements are in the state
     */
	load() {
		for (var w = 0; w < this.width; w++) {
			this.pixels[w] = []
			for (var h = 0; h < this.height; h++) {
				let index = (w + h * width) * 4
				// Leave out the alpha channel for now
				this.pixels[w][h] = [img.pixels[index], img.pixels[index + 1], img.pixels[index + 2], /* pixels[index + 3] */]
				this.determineElement(this.pixels[w][h], w, h)
			}
		}
		this.findPlayer()
	}

    /**
     * Classify elements based on their color
     */
	determineElement(colors, x, y) {
		// Is it a wall element?
		if (colorsInRange(colors, WALL)) {
			this.walls.push(new Wall(x, y))
			return
		}
		// Is it a line element?
		if (colorsInRange(colors, LINE)) {
			this.line.push(new Line(x, y))
			return
		}
		// Is it a 'flying' point element?
		// This will include the player initially!
		if (colorsInRange(colors, POINT)) {
			this.points.push(new Point(x, y))
			return
		}
		// Is it empty space?
		if (colorsInRange(colors, EMPTY)) {
			this.empty++
			return
		}
		else {
			this.unknown++
			return
		}
	}

	/**
	 * Find and splice the player's elements from the Points array
	 */
	findPlayer() {
		noFill()
		this.points.forEach(function (v, i, a) {
			// If it has a pink colored neighbor (a line element),
			// then it's the player
			if (this.hasNeighbour(v.x, v.y, this.line)) {
				if (!this.hasNeighbour(v.x, v.y, this.walls)) {
					/* stroke(255, 0, 0, 255)
					ellipse(v.x, v.y, ALERT_RADIUS) */
					this.player.push([v.x, v.y])
					this.points.splice(i, 0)
				}
			}
			// Otherwise it is a point element
		}, this) // bind context to callback
		return
	}

	/**
	 * Check if an element (x,y) has a neighbour from a given array
	 * Neighbour color defaults to LINE
	 */
	hasNeighbour(x, y, arr = this.line) {
		//console.log(this.pixels[x][y], nbc)
		let index = 0
		while (index < arr.length) {
			if (dist(x, y, arr[index].x, arr[index].y) <= 2) {
				return true
			}
			index++
		}
	}

    /**
     * Log properties and checks
     */
	log() {
		console.log(this.pixels.length * this.pixels[0].length, 'all points')
		console.log(this.player.length, 'player points', (this.player.length > 0 ? String.fromCharCode(0x2713) : '!!!'))
		console.log(this.walls.length, 'wall points')
		console.log(this.line.length, 'line points')
		console.log(this.points.length, 'floating points')
		console.log(this.empty, 'empty space')
		console.log(this.unknown, 'unknown points', (this.unknown == 0 ? String.fromCharCode(0x2713) : '!!!'))
		let all = this.walls.length + this.line.length + this.points.length + this.empty + this.unknown
		console.log(all, '<', width * height, (all < width * height ? String.fromCharCode(0x2713) : '!!!'))
		console.log('framerate:', Math.round(frameRate()))
	}

    /**
     * Draw an array of elements.
     * Default color is red.
     */
	colorize(arr, color = [200, 0, 0, 255]) {
		arr.forEach(function (v, i, a) {
			stroke(...color)
			point(v.x, v.y)
		})
	}

    /**
     * Draw the intersection of the radius of an array of elements
     * with another array of elements
     * Default color is red
	 * Default radius is ALERT_RADIUS
     */
	emphasize(arr, arr2, color = [200, 0, 0, 255], radius = ALERT_RADIUS) {
		// Loop through all given elements
		arr.forEach(function (v, i, a) {
			// Check element against all wall elements
			arr2.forEach(function (vw, iw, aw) {
				// Only check each n-th and nw-th elements
				if (i % SPREAD > 0 && iw % SPREAD > 0) return
				// Check if the distance between the element and the wall
				// is smaller than the ALERT_RADIUS constant
				if (dist(vw.x, vw.y, v.x, v.y) < radius) {
					vw.alert = true
				}
			}, this) // bind context to callback
		}, this) // bind context to callback
		// Color the dangerously close wall points (alert is true)
		arr2.forEach(function (v, i, a) {
			if (v.alert) {
				stroke(...color)
				point(v.x, v.y)
			}
		})
	}

}

/**
 * Check if the two colors (c1,c2)[RGB(A)] are in a range of each other,
 * meaning they are similar / same
 */
function colorsInRange(c1, c2, range = COLOR_RANGE) {
	return (
		inRange(c1[0], c2[0], range)
		&& inRange(c1[1], c2[1], range)
		&& inRange(c1[2], c2[2], range)
		//&& inRange(c1[3], c2[3])
	)
}
/**
 * Check if a number x is in the range of the target number
 * Range defaults to the COLOR_RANGE constant
 */
function inRange(x, target, range = COLOR_RANGE) {
	return (dist(x, 0, target, 0) < range)
	//return (x < target + range && x > target - range);
}