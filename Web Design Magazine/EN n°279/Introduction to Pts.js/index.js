// Pts.namespace( window );

Pts.quickStart("#pt", "#1e2f40");
(function () {
    let world;

    space.add({
        start: (bound, space) => {
            // Create the world and 30 random points
            world = new World( space.innerBound, 1, 0 );
            let pts = Create.distributeRandom(space.innerBound, 80);

            // Create particles and hit them with a random impulse
            for(let i=0; i<pts.length; i++) {
                let p = new Particle(pts[i]).size((i === 0) ? 30: 3 + Math.random() * space.size.x / 50);
                p.hit(Num.randomRange(-50, 50), Num.randomRange(-25, 25));
                world.add(p)
            }
            world.particle(0).lock = true;
        },
        animate: (time, ftime) => {
            world.drawParticles((p, i) => {
                let color = (i === 0) ? "#1e2f40" : ["#ff2d5d", "#42dc8e", "#2e43eb", "#ffe359"][i%4];
                form.fillOnly(color).point(p, p.radius, "circle")
            });
            world.update(ftime)
        },
        action: (type, x, y, event) => {
            if (type === "move") {
                world.particle(0).position = new Pt(x, y);
            }
        },
        resize: (size, event) => {},
    });
    space.bindMouse().bindTouch();
    space.play();
})();