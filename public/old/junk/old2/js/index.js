// ============================================================================================

const menu = document.querySelector('.menu');
const menuItem = document.querySelectorAll('.menu-item');

for (var item; item<5; item++) {
  item.addEventListener('click', () => {
    menu.querySelector('.active').classList.remove('active');
    item.classList.add('active');
  });
};

/*function autoResizeDiv() {
  document.getElementById('scr').style.height = window.innerHeight +'px';
}
window.onresize = autoResizeDiv;
autoResizeDiv();*/

// ============================================================================================




// ============================================================================================

function init() {
  // easal stuff goes hur
  var xCenter = 150;
  var yCenter = 150;
  var stage = new createjs.Stage('joystick');

  var psp = new createjs.Shape();
  psp.graphics.beginFill('rgb(255, 120, 0)').drawCircle(xCenter, yCenter, 90);

  psp.alpha = 0.8;

  var vertical = new createjs.Shape();
  var horizontal = new createjs.Shape();
  

  stage.addChild(psp);
  stage.addChild(vertical);
  stage.addChild(horizontal);
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener('tick', stage);
  stage.update();

  var myElement = $('#joystick')[0];

  // create a simple instance
  // by default, it only adds horizontal recognizers
  var mc = new Hammer(myElement);

  mc.on("panstart", function(ev) {
    var pos = $('#joystick').position();
    xCenter = psp.x;
    yCenter = psp.y;
    psp.alpha = 0.8;
    
    stage.update();
  });
  
  // listen to events...
  mc.on("panmove", function(ev) {
    var pos = $('#joystick').position();

    var x = (ev.center.x - pos.left - 150);
    var y = (ev.center.y - pos.top - 150);
    // $('#xVal').text('X: ' + x);
    // $('#yVal').text('Y: ' + (-1 * y));
    
    var coords = calculateCoords(ev.angle, ev.distance);
    
    psp.x = coords.x;
    psp.y = coords.y;

    psp.alpha = 0.8;
    
    stage.update();
  });
  
  mc.on("panend", function(ev) {
    psp.alpha = 0.8;
    createjs.Tween.get(psp).to({x:xCenter,y:yCenter},750,createjs.Ease.elasticOut);
  });
}

function calculateCoords(angle, distance) {
  var coords = {};
  distance = Math.min(distance, 100);  
  var rads = (angle * Math.PI) / 180.0;

  coords.x = distance * Math.cos(rads);
  coords.y = distance * Math.sin(rads);
  
  return coords;
}

// ============================================================================================



// ============================================================================================


// var slider = document.getElementById('test-slider');
//   noUiSlider.create(slider, {
//    start: [20, 80],
//    connect: true,
//    step: 1,
//    orientation: 'horizontal', // 'horizontal' or 'vertical'
//    range: {
//      'min': 0,
//      'max': 100
//    },
//    format: wNumb({
//      decimals: 0
//    })
//   });

// ============================================================================================