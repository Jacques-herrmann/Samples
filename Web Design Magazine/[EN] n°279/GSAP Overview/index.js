// tween x position from current to 400 over 2 seconds
// TweenMax.to(".image", 2, { x:400 });

// tween y position from current to 200 and opacity to 0,  over 1second
// TweenMax.to(".image", 1, { y:200, opacity:0 });

// tween x and y to 100, scale to 1.5, and rotate 90 deg,  over 2 second
// TweenMax.to(".image", 2, { x:100, y:100, scale:1.5, rotation:90 });

// easing In with circ
// TweenMax.to(".image", 2, { x:100, y: 100, rotation: 90, ease: Circ.easeIn });
// easing Out with a bounce
// TweenMax.to(".image", 2, { x:100, y:100, rotation:90, ease:Bounce.easeOut });
// easing In and Out with elastic
// TweenMax.to(".image", 2, { x:100, y:100, rotation:90, ease:Elastic.easeInOut });

// // --- Two synchronized animation : ---
// TweenMax.to(".image", 1, { y:100, ease:Bounce.easeOut });
// // delay this tween by 1 sec
// TweenMax.to(".image", 1, { rotation:90, ease:Circ.easeOut, delay:1 });

// // --- CallBack function ---
// TweenMax.to(".image", 1, { y:100, ease:Bounce.easeOut, onComplete:tweenComplete});
// function tweenComplete() {
//  console.log("tween complete");
// }

// // --- CallBack parameter ---
// TweenMax.to(".image", 1, {
//     y: 100,
//     ease: Bounce.easeOut,
//     onUpdate: tweenUpdate,
//     onUpdateParams:["{self}","completed"]
// });
// function tweenUpdate(tween, message) {
//     const percentage = tween.progress() * 100;
//     // progress() is a value 0-1
//     console.log(percentage+ " " + message);
// }

// // --- Controlling Animations ---
// // var to hold reference to tween
// const tween = TweenMax.to(".image", 2, { y:100,  ease:Bounce.easeOut });
// // pause immediately
// tween.pause();
// // start on event
// setTimeout(function(){ tween.resume() },1000);
// // reverse animation on event
// setTimeout(function(){ tween.reverse() },3000);

// // --- 2D & 3D transforms ---
// TweenMax.to(".image", 3, { x:100, y:100, scale:1.5, rotationY:360, ease:Bounce.easeOut });

// --- Timelines ---
//create a timeline instance
const tl = new TimelineMax({ repeat: -1, yoyo: true }); // infinite
tl.add(TweenMax.to(".image", 1, { x: 50 }));
// note the final “0” to make this one start at 0 sec.
tl.add(TweenMax.to(".image", 1, { y: 100 }), "0");
//note the “+.25” to make thisone start at .25 sec
tl.add(TweenMax.to(".image", 1, { rotationY: 180, y: 50, x: 50 }), "+.25");

// get the current duration of the timeline
console.log(tl.duration());
//sets the duration to 5 seconds after a 2 sec wait
setTimeout(function(){
    tl.duration(5);
}, 2000);