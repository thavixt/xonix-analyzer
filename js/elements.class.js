"use strict";

class Element {
    constructor(x, y, px = null, py = null) {
        this.x = x
        this.y = y
        this.px = px
        this.py = py
    }
}

class Point extends Element {
    constructor(x, y, px = null, py = null) {
        super(x, y, px, py)
    }
}
class OuterPoint extends Element {
    constructor(x, y, px = null, py = null) {
        super(x, y, px, py)
    }
}

class Player extends Element {
    constructor(x, y, px = null, py = null) {
        super(x, y, px, py)
    }
}
class Line extends Element {
    constructor(x, y, px = null, py = null) {
        super(x, y, px, py)
    }
}

class Wall {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}