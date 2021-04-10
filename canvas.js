let canvas = document.querySelector("canvas#pizarra");

canvas.width = window.innerWidth * 0.65; /* 0.95 */
canvas.height = window.innerHeight * 0.8; /* 0.80 */
canvas.style.cssText =
  "background: white; border: 3px black solid; border-radius: 10px";

let c = canvas.getContext("2d");

let initialActiveColor = "black";
let activeColor = initialActiveColor;
let activeColorButton = document.getElementById("colorActual");

// listening to resizing of the canvas

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth * 0.65;
  canvas.height = window.innerHeight * 0.8;
});

/* ------------------------  */

// identifying the main color of the elements

const mainColor = document.querySelectorAll(".big-square-color");
mainColor.forEach((color) => {
  color.addEventListener("click", (e) => {
    activeColor = e.target.id;
    activeColorButton.style.backgroundColor = activeColor;
  });
});

/* ------------------ */

// fill up or not the elements created
let fillup = false;
const filled = document.getElementById("filled");
filled.addEventListener("click", () => {
  fillup = !fillup;
  if (fillup) filled.style.backgroundColor = activeColor;
  if (!fillup) filled.style.backgroundColor = "white";
});

/* ----------------------- */

// change background color of the canvas

const bgColor = document.querySelectorAll(".bgColor");
bgColor.forEach((bg) => {
  const color = bg.id.slice(3, bg.length);
  bg.addEventListener("click", function changeCanvasBG() {
    canvas.style.backgroundColor = color;
  });
});

/* --------------------------- */

// clear canvas

const clearCanvas = document.getElementById("clearAll");
clearCanvas.addEventListener("click", clearAll);

function clearAll() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

/* ------------------- */

// erase

const eraseRubber = document.getElementById('erase');
eraseRubber.addEventListener('click', startErase);

/* ------------------ */

// stroke size

const strokes = document.querySelectorAll(".stroke");
const initialStrokeSize = 1;
let strokeSelected = initialStrokeSize;
let activeStroke = strokes[0];
strokes.forEach((stroke) => {
  stroke.addEventListener("click", () => {
    activeStroke.classList.remove("activeButton");
    activeStroke = stroke;
    switch (stroke.id) {
      case "size-s":
        strokeSelected = 1;
        stroke.classList.add("activeButton");
        break;
      case "size-m":
        strokeSelected = 3;
        stroke.classList.add("activeButton");
        break;
      case "size-l":
        strokeSelected = 5;
        stroke.classList.add("activeButton");
        break;
      case "size-xl":
        strokeSelected = 10;
        stroke.classList.add("activeButton");
        break;
      case "size-xxl":
        strokeSelected = 15;
        stroke.classList.add("activeButton");
        break;
    }
  });
});

// switch between possible elements to be created

const elements = document.querySelectorAll(".element");
elements.forEach((element) => {
  element.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "triangle":
        console.log("Triangle");
        element.classList.add("activeButton");
        startTriangle();
        break;
      case "manoLibre":
        element.classList.add("activeButton");
        startHandFree();
        console.log("Manos libres");
        break;
      case "lineaRecta":
        element.classList.add("activeButton");
        console.log("Linea Recta");
        startLine();
        break;
      case "circle":
        element.classList.add("activeButton");
        startCircle();
        console.log("Circle");
        break;
    }
  });
});

/* ----------------------- */

// drawing triangles

async function startTriangle() {
  let threePointsArray = [];
  const handleClick = (e) => {
    threePointsArray.push({ x: e.offsetX, y: e.offsetY });

    if (threePointsArray.length === 3) {
      canvas.removeEventListener("click", handleClick);
      drawTriangle(threePointsArray);
    }
  };
  canvas.addEventListener("click", handleClick);
}

function drawTriangle(vertices) {
  c.beginPath();
  c.lineWidth = strokeSelected;

  c.moveTo(vertices[0].x, vertices[0].y);
  c.lineTo(vertices[1].x, vertices[1].y);
  c.lineTo(vertices[2].x, vertices[2].y);
  c.lineTo(vertices[0].x, vertices[0].y);

  if (fillup) {
    c.fillStyle = activeColor;
    c.fill();
  }

  if (!fillup) {
    c.strokeStyle = activeColor;
    c.stroke();
  }
  document.getElementById("triangle").classList.remove("activeButton");
}

/* ----------------------- */

// drawing lines

function startLine() {
  let twoPointsArray = [];
  const handleClick = (e) => {
    twoPointsArray.push({ x: e.offsetX, y: e.offsetY });

    if (twoPointsArray.length === 2) {
      canvas.removeEventListener("click", handleClick);
      drawLine(twoPointsArray);
    }
  };
  canvas.addEventListener("click", handleClick);
}

function drawLine(twoPointsArray) {
  c.beginPath();
  c.moveTo(twoPointsArray[0].x, twoPointsArray[0].y);
  c.lineTo(twoPointsArray[1].x, twoPointsArray[1].y);
  c.strokeStyle = activeColor;
  c.lineWidth = strokeSelected;
  c.stroke();
  document.getElementById("lineaRecta").classList.remove("activeButton");

  return;
}

/* ----------------------------- */

// drawing circles

function startCircle() {
  const twoPointsArray = [];
  //   const newCanvasId = createCanvas();
  const newCanvas = document.getElementById("secretCanvas");
  newCanvas.height = canvas.height;
  newCanvas.width = canvas.width;
  newCanvas.style.cssText =
    "top: 50px; left: 0; z-index: 99; visibility: visible";
  const newCanvasContext = newCanvas.getContext("2d");

  const handleMouseMove = (e) => {
    if (twoPointsArray.length > 0) {
      newCanvasContext.clearRect(0, 0, innerWidth, innerHeight);
      newCanvasContext.beginPath();
      newCanvasContext.moveTo(twoPointsArray[0].x, twoPointsArray[0].y);
      newCanvasContext.lineTo(e.offsetX, e.offsetY);
      newCanvasContext.stroke();
    }
  };

  const handleClick = (e) => {
    twoPointsArray.push({ x: e.offsetX, y: e.offsetY });

    if (twoPointsArray.length === 2) {
      newCanvas.removeEventListener("click", handleClick);
      newCanvas.removeEventListener("mousemove", handleMouseMove);
      newCanvas.style.cssText = "z-index: -1; visibility: hidden";
      document.getElementById("circle").classList.remove("activeButton");
      drawCircle(calculateGreaterDistance(twoPointsArray), twoPointsArray);
    }
  };

  newCanvas.addEventListener("click", handleClick);
  newCanvas.addEventListener("mousemove", handleMouseMove);
}

function calculateGreaterDistance(twoPointsArray) {
  let APart = 0;
  let BPart = 0;
  if (twoPointsArray[0].x > twoPointsArray[1].x) {
    APart = twoPointsArray[0].x - twoPointsArray[1].x;
  } else {
    APart = twoPointsArray[1].x - twoPointsArray[0].x;
  }

  if (twoPointsArray[0].y > twoPointsArray[1].y) {
    BPart = twoPointsArray[0].y - twoPointsArray[1].y;
  } else {
    BPart = twoPointsArray[1].y - twoPointsArray[0].y;
  }

  if (APart - BPart > 0) {
    return APart;
  } else {
    return BPart;
  }
}

function drawCircle(radio, twoPointsArray) {
  c.beginPath();
  c.arc(twoPointsArray[0].x, twoPointsArray[0].y, radio, 0, Math.PI * 2, true);
  c.strokeStyle = activeColor;
  c.lineWidth = activeStroke;
  if (fillup == true) {
    c.fillStyle = activeColor;
    c.fill();
  } else {
    c.stroke();
  }
}

// drawing free hand

function startHandFree() {
  const twoPointsArray = [];
  let previousPoint={};

  const handleMove = (e) => {
    if (twoPointsArray.length > 0) {
      drawHandFree(e, previousPoint);
      previousPoint = {
        x: e.offsetX,
        y: e.offsetY,
      };
    }
  };

  const handleClick = (e) => {
    twoPointsArray.push({ x: e.offsetX, y: e.offsetY });
    previousPoint = {
      x: e.offsetX,
      y: e.offsetY,
    };
    if (twoPointsArray.length === 2) {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMove);
      document.getElementById("manoLibre").classList.remove("activeButton");
    }
  };

  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("mousemove", handleMove);
}

function drawHandFree(e, previousPoint) {
  c.beginPath();
  c.moveTo(previousPoint.x, previousPoint.y);
  c.lineTo(e.offsetX, e.offsetY);
  c.lineWidth = strokeSelected;
  c.strokeStyle = activeColor;
  c.stroke();
}

/* --------------------------------- */


// erase function


function startErase() {
    const twoPointsArray = [];
    let previousPoint={};
  
    const handleMove = (e) => {
      if (twoPointsArray.length > 0) {
        erase(e, previousPoint);
        previousPoint = {
          x: e.offsetX,
          y: e.offsetY,
        };
      }
    };
  
    const handleClick = (e) => {
      twoPointsArray.push({ x: e.offsetX, y: e.offsetY });
      previousPoint = {
        x: e.offsetX,
        y: e.offsetY,
      };
      if (twoPointsArray.length === 2) {
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("mousemove", handleMove);
        document.getElementById("erase").classList.remove("activeButton");
      }
    };
  
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMove);
  }
  
  function erase(e, previousPoint) {
    c.beginPath();
    c.moveTo(previousPoint.x, previousPoint.y);
    c.lineTo(e.offsetX, e.offsetY);
    c.lineWidth = 5;
    console.log(document.getElementById('pizarra').style.backgroundColor)
    c.strokeStyle = document.getElementById('pizarra').style.backgroundColor;
    c.stroke();
  }
