Keyframely (a jQuery-less Runloop)
==================================

A rewrite of [runloop](https://github.com/KuraFire/runloop) that removes the dependency on
jQuery. Props to KuraFire for the original -- it's an awesome idea.

Usage
-----
In node:

    var puts = require('util').puts,
        loop = require('keyframely').loop;

    var ourLoop = loop(Math.round.bind(Math), loop.easings.cubic_out);

    ourLoop.addKey('0%', function(ctls) {
      puts('0');
    });
    ourLoop.addKey('6%', function(ctls) {
      puts('6');
    });
    ourLoop.addKey('24%', function(ctls) {
      puts('24');
    });
    ourLoop.addKey('55%', function(ctls) {
      puts('55');
    });

    ourLoop.play(1000, function(ctls) {
      puts('done');
    });

Or in browser:

    <script src="keyframely.js"></script>
    <script type="text/javascript">
        var ourLoop = keyframely.loop();
        ourLoop.addKey('50%', function(ctls) {
            document.write('HALLO WORLD');
        }); 

        ourLoop.play(1000, function(ctls) {
            document.write('No really hello.');
        });
    </script>

The biggest deviation from the original api is that a control object is passed to the keyframe callback.
It provides the following:

*  `quit`: Quits the loop immediately.
*  `pause`: Pauses the loop. Resume the loop using `play` on the controls object.
*  `play`: Continues playing the loop.

This is done so that key frames can be retrieved and used on other loops using `getMap` and `addMap`, respectively.

License
-------
New BSD.

Why?
----
Runloop is a great idea, and could be used to simulate, for example, request latency in Node. Unfortunately,
since it is written as a jQuery plugin, it eschews that possibility out of the gate. No ill will intended! I just
want to be able to use it when I don't have access to jQuery :)
