"use strict";

/**
 * Take over (in a proxy-ing way) the console object
 * From: http://tobyho.com/2012/07/27/taking-over-console-log/
 */
/* function takeOverConsole() {
    var console = window.console
    if (!console) return
    function intercept(method) {
        var original = console[method]
        console[method] = function () {
            // do sneaky stuff
            if (original.apply) {
                // Do this for normal browsers
                original.apply(console, arguments)
            } else {
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                original(message)
            }
        }
    }
    var methods = ['log', 'warn', 'error']
    for (var i = 0; i < methods.length; i++)
        intercept(methods[i])
} */

/**
 * Modified version to take over console.log and console.clear only
 * and put all it's output to the output div as well
 * TODO: create a function to loop over objects
 *       and apply their function as the callback in the 'proxy'
 */
(function takeOverConsoleLog() {
    let output = document.getElementById('log');
    var console = window.console
    if (console) {
        // Intercept the console.log calls
        var originalLog = console['log']
        console.log = function () {
            // Do your own sneaky stuff
            if (originalLog.apply) {
                // Do this for normal browsers
                /* let e = document.createElement("li")
                let t = document.createTextNode([...arguments].join(' '))
                output.appendChild(e.appendChild(t)); */
                output.innerHTML += "<li>" + [...arguments].join(' ') + "</li>"
                //originalLog.apply(console, arguments)
            }
            else {
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                originalLog(message)
            }
        }

        // Intercept the console.clear calls
        var originalClear = console['clear']
        console.clear = function () {
            // Do your own sneaky stuff
            if (originalClear.apply) {
                // Do this for normal browsers
                output.innerHTML = ""
                originalClear.apply(console, arguments)
            }
            else {
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                originalClear(message)
            }
        }
        console.clear()
    }
})()
