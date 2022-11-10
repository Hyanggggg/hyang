var canvas = $("#wrapper-canvas").get(0);

var dimensions = {
  width: $(window).width(),
  height: $(window).height(),
};

Matter.use("matter-attractors");
Matter.use("matter-wrap");

function runMatter() {
  var Engine = Matter.Engine,
    Events = Matter.Events,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Common = Matter.Common,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint;
  Bodies = Matter.Bodies;

  // engine
  var engine = Engine.create(),
    world = engine.world;

  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;
  engine.world.gravity.scale = 0.1;

  // renderer
  var render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      showVelocity: false,
      width: dimensions.width,
      height: dimensions.height,
      wireframes: false,
      background: "rgb(240,240,240)",
    },
  });

  Render.run(render);
  // runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  var world = engine.world;
  world.gravity.scale = 0;
  // 마우스
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
  World.add(world, mouseConstraint);
  //핑쿠
  (rockOptions = {
    density: 0.005,
    render: {
      fillStyle: `#F469FF`,
      strokeStyle: `#EF5AFF`,
      lineWidth: 0,
    },
    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
          };
        },
      ],
    },
  }),
    (rock = Bodies.polygon(
      $(window).width() / 2,
      $(window).height() / 2,
      8,
      70,
      rockOptions
    )),
    (anchor = { x: $(window).width() / 2, y: $(window).height() / 2 }),
    (elastic = Constraint.create({
      pointA: anchor,
      bodyB: rock,
      stiffness: 0.02,
    }));
  World.add(world, rock);
  World.add(world, elastic);

  for (var i = 0; i < 90; i += 1) {
    let x = Common.random(0, render.options.width);
    let y = Common.random(0, render.options.height);
    let s =
      Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
    let poligonNumber = Common.random(3, 8);
    //다각형ㄷ
    var body = Bodies.polygon(
      x,
      y,
      poligonNumber,
      s,

      {
        mass: s / 80,
        friction: 0,
        frictionAir: 0.02,

        angle: Math.round(Math.random() * 360),
        render: {
          fillStyle: "#FFFFFF",
          strokeStyle: `#2FFC61`,
          lineWidth: 2,
        },
      }
    );

    World.add(world, body);
    //초록
    let r = Common.random(0, 4);
    var circle = Bodies.circle(x, y, Common.random(2, 30), {
      mass: 0.2,
      render: {
        fillStyle: r > 2 ? `#2FFC61` : `rgb(240,240,240)`,
        strokeStyle: `#00FF36F`,
        lineWidth: 3,
      },
    });

    World.add(world, circle);
    //파랑
    var circle = Bodies.circle(x, y, Common.random(2, 40), {
      mass: 0.5,
      friction: 0,
      frictionAir: 0,
      render: {
        fillStyle: r > 1 ? `#2727FF` : `rgb(240,240,240)`,
        strokeStyle: `#4A4AFF`,
        lineWidth: 5,
      },
    });

    World.add(world, circle);
    //회색
    var circle = Bodies.circle(x, y, Common.random(2, 50), {
      mass: 0.8,
      friction: 0.6,
      frictionAir: 0.6,
      render: {
        fillStyle: `rgb(240,240,240)`,
        strokeStyle: `#F6B6FF`,
        lineWidth: 3,
      },
    });

    World.add(world, circle);
  }

  let data = {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
    play: function () {
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);
    },
  };

  Matter.Runner.run(runner, engine);
  Matter.Render.run(render);
  return data;
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function setWindowSize() {
  let dimensions = {};
  dimensions.width = $(window).width();
  dimensions.height = $(window).height();

  m.render.canvas.width = $(window).width();
  m.render.canvas.height = $(window).height();
  return dimensions;
}

let m = runMatter();
setWindowSize();
$(window).resize(debounce(setWindowSize, 250));
