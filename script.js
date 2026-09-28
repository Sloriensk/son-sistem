/* =========================================================
   VIOLET STUDIO
   Main Website + Creative Workspace
========================================================= */


/* =========================================================
   YEAR
========================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {

  menuBtn.addEventListener("click", () => {

    mainNav.classList.toggle("open");

    menuBtn.textContent =
      mainNav.classList.contains("open")
        ? "✕"
        : "☰";

  });


  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      menuBtn.textContent = "☰";

    });

  });

}


/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow) {

  window.addEventListener("pointermove", event => {

    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;

  });

}


/* =========================================================
   AMBIENT BACKGROUND
   Particles + waves + stars
========================================================= */

const ambientCanvas =
  document.getElementById("ambientCanvas");

const ctx =
  ambientCanvas?.getContext("2d");


let ambientWidth = window.innerWidth;
let ambientHeight = window.innerHeight;

const particles = [];

const PARTICLE_COUNT = 80;


function resizeAmbientCanvas() {

  if (!ambientCanvas || !ctx) return;

  ambientWidth = window.innerWidth;
  ambientHeight = window.innerHeight;

  ambientCanvas.width = ambientWidth * devicePixelRatio;
  ambientCanvas.height = ambientHeight * devicePixelRatio;

  ambientCanvas.style.width =
    `${ambientWidth}px`;

  ambientCanvas.style.height =
    `${ambientHeight}px`;

  ctx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );

}


function random(min, max) {
  return Math.random() * (max - min) + min;
}


function createParticles() {

  particles.length = 0;

  for (let i = 0; i < PARTICLE_COUNT; i++) {

    particles.push({
      x: random(0, ambientWidth),
      y: random(0, ambientHeight),
      radius: random(.4, 1.8),
      velocityX: random(-.15, .15),
      velocityY: random(-.11, .11),
      alpha: random(.15, .6),
      phase: random(0, Math.PI * 2)
    });

  }

}


function drawAmbient(time) {

  if (!ctx) return;

  ctx.clearRect(
    0,
    0,
    ambientWidth,
    ambientHeight
  );


  /* stars / particles */

  particles.forEach(p => {

    p.x += p.velocityX;
    p.y += p.velocityY;

    p.phase += .01;

    if (p.x < -10) p.x = ambientWidth + 10;
    if (p.x > ambientWidth + 10) p.x = -10;

    if (p.y < -10) p.y = ambientHeight + 10;
    if (p.y > ambientHeight + 10) p.y = -10;


    const alpha =
      p.alpha +
      Math.sin(p.phase) * .12;


    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(168,139,250,${Math.max(
        .04,
        alpha
      )})`;

    ctx.fill();

  });


  /* ambient waves */

  drawWave(
    time,
    ambientHeight * .82,
    0.009,
    18,
    .22
  );

  drawWave(
    time * .7,
    ambientHeight * .88,
    0.012,
    12,
    .13
  );


  requestAnimationFrame(drawAmbient);

}


function drawWave(
  time,
  baseY,
  frequency,
  amplitude,
  alpha
) {

  if (!ctx) return;

  ctx.beginPath();

  for (
    let x = 0;
    x <= ambientWidth;
    x += 10
  ) {

    const y =
      baseY +
      Math.sin(
        x * frequency + time * .0005
      ) * amplitude;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

  }

  ctx.strokeStyle =
    `rgba(139,92,246,${alpha})`;

  ctx.lineWidth = 1;

  ctx.stroke();

}


window.addEventListener(
  "resize",
  () => {

    resizeAmbientCanvas();
    createParticles();

  }
);


resizeAmbientCanvas();
createParticles();

if (ctx) {
  requestAnimationFrame(drawAmbient);
}


/* =========================================================
   INSPIRATION SEARCH
========================================================= */

const inspirationInput =
  document.getElementById("inspirationInput");

const inspirationButton =
  document.getElementById("inspirationButton");


function searchInspiration() {

  const query =
    inspirationInput?.value.trim();

  if (!query) {

    inspirationInput?.focus();

    return;

  }


  const searchQuery =
    `${query} design inspiration`;


  const url =
    `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
      searchQuery
    )}`;


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


inspirationButton?.addEventListener(
  "click",
  searchInspiration
);


inspirationInput?.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      event.preventDefault();

      searchInspiration();

    }

  }
);


/* =========================================================
   STUDIO
========================================================= */

const studioOverlay =
  document.getElementById("studioOverlay");

const closeStudioButton =
  document.getElementById("closeStudio");

const studioTitle =
  document.getElementById("studioTitle");

const studioSubtitle =
  document.getElementById("studioSubtitle");

const designCanvas =
  document.getElementById("designCanvas");

const canvasEmpty =
  document.getElementById("canvasEmpty");

const editorHint =
  document.getElementById("editorHint");

const projectName =
  document.getElementById("projectName");

const objectColor =
  document.getElementById("objectColor");

const layerList =
  document.getElementById("layerList");


let currentStudio = "Graphic Studio";

let currentEditorTool = "select";

let selectedObject = null;

let objectCounter = 0;

let historyStack = [];

let redoStack = [];


/* =========================================================
   STUDIO SETTINGS
========================================================= */

const studioDescriptions = {

  "Graphic Studio":
    "Canvas • Layers • Shapes • Text",

  "2D Canvas":
    "Free Drawing • Shapes • Color",

  "UI / UX Studio":
    "Interface • Components • Mobile",

  "3D Studio":
    "Objects • Scene • Transform",

  "Logo Studio":
    "Brand • Symbol • Typography",

  "Social Studio":
    "Posts • Stories • Campaign",

  "Web Studio":
    "Layout • Components • Web",

  "Violet AI":
    "Creative Assistant • Coming Soon"

};


/* =========================================================
   OPEN STUDIO
========================================================= */

function openStudio(toolName) {

  currentStudio =
    toolName || "Graphic Studio";


  if (studioTitle) {
    studioTitle.textContent =
      currentStudio;
  }


  if (studioSubtitle) {
    studioSubtitle.textContent =
      studioDescriptions[currentStudio] ||
      "Creative Workspace";
  }


  if (studioOverlay) {

    studioOverlay.classList.add("open");

    studioOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  resetEditorForStudio();

}


function closeStudio() {

  studioOverlay?.classList.remove("open");

  studioOverlay?.setAttribute(
    "aria-hidden",
    "true"
  );

}


document.addEventListener(
  "click",
  event => {

    const target =
      event.target.closest("[data-tool]");

    if (!target) return;

    const tool =
      target.getAttribute("data-tool");

    openStudio(tool);

  }
);


closeStudioButton?.addEventListener(
  "click",
  closeStudio
);


studioOverlay?.addEventListener(
  "click",
  event => {

    if (event.target === studioOverlay) {
      closeStudio();
    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      studioOverlay?.classList.contains("open")
    ) {

      closeStudio();

    }

  }
);


/* =========================================================
   EDITOR MODE
========================================================= */

function resetEditorForStudio() {

  if (!designCanvas) return;


  selectedObject = null;

  objectCounter = 0;

  historyStack = [];

  redoStack = [];


  designCanvas
    .querySelectorAll(
      ".canvas-object, .object-draw"
    )
    .forEach(
      element => element.remove()
    );


  canvasEmpty.style.display =
    "flex";


  updateLayers();


  if (currentStudio === "3D Studio") {

    editorHint.textContent =
      "3D sahnene obje eklemek için araçları kullan.";

  }

  else if (currentStudio === "UI / UX Studio") {

    editorHint.textContent =
      "Telefon arayüzünü oluşturmaya başla.";

  }

  else if (currentStudio === "Violet AI") {

    editorHint.textContent =
      "Violet AI geliştiriliyor.";

  }

  else {

    editorHint.textContent =
      "Bir araç seç ve üretmeye başla.";

  }

}


/* =========================================================
   TOOLS
========================================================= */

const editorTools =
  document.querySelectorAll(
    "[data-editor-tool]"
  );


editorTools.forEach(toolButton => {

  toolButton.addEventListener(
    "click",
    () => {

      editorTools.forEach(
        button =>
          button.classList.remove("active")
      );


      toolButton.classList.add("active");


      currentEditorTool =
        toolButton.getAttribute(
          "data-editor-tool"
        );


      updateHint();

    }
  );

});


function updateHint() {

  const messages = {

    select:
      "Objeyi seç ve sürükle.",

    text:
      "Canvas'a metin eklemek için tıkla.",

    rectangle:
      "Canvas'a kare eklemek için tıkla.",

    circle:
      "Canvas'a daire eklemek için tıkla.",

    draw:
      "Mouse ile çiz.",

    image:
      "Görsel alanı yakında."

  };


  editorHint.textContent =
    messages[currentEditorTool] ||
    "Tasarlamaya başla.";

}


/* =========================================================
   CANVAS CLICK
========================================================= */

let drawing = false;

let drawStartX = 0;

let drawStartY = 0;

let drawPreview = null;


designCanvas?.addEventListener(
  "mousedown",
  event => {

    const rect =
      designCanvas.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;


    if (currentEditorTool === "select") {

      const object =
        event.target.closest(
          ".canvas-object"
        );

      if (object) {

        selectObject(object);

      } else {

        deselectObject();

      }

      return;

    }


    if (currentEditorTool === "text") {

      createText(x, y);

      return;

    }


    if (currentEditorTool === "rectangle") {

      createRectangle(x, y);

      return;

    }


    if (currentEditorTool === "circle") {

      createCircle(x, y);

      return;

    }


    if (currentEditorTool === "draw") {

      startDrawing(
        x,
        y
      );

    }

  }
);


/* =========================================================
   FREE DRAW
========================================================= */

function startDrawing(x, y) {

  drawing = true;

  drawStartX = x;
  drawStartY = y;


  drawPreview =
    document.createElement("div");

  drawPreview.className =
    "object-draw";

  drawPreview.style.left =
    `${x}px`;

  drawPreview.style.top =
    `${y}px`;

  designCanvas.appendChild(
    drawPreview
  );

}


designCanvas?.addEventListener(
  "mousemove",
  event => {

    if (!drawing || !drawPreview) {
      return;
    }


    const rect =
      designCanvas.getBoundingClientRect();

    const currentX =
      event.clientX - rect.left;

    const currentY =
      event.clientY - rect.top;


    const width =
      Math.max(
        2,
        currentX - drawStartX
      );


    const height =
      Math.max(
        2,
        currentY - drawStartY
      );


    drawPreview.style.width =
      `${width}px`;

    drawPreview.style.height =
      `${height}px`;

  }
);


window.addEventListener(
  "mouseup",
  () => {

    if (!drawing) return;

    drawing = false;

    if (!drawPreview) return;


    const width =
      parseFloat(
        drawPreview.style.width
      );

    const height =
      parseFloat(
        drawPreview.style.height
      );


    if (
      !width ||
      !height ||
      width < 4 ||
      height < 4
    ) {

      drawPreview.remove();

      drawPreview = null;

      return;

    }


    objectCounter++;


    drawPreview.dataset.id =
      `draw-${objectCounter}`;


    drawPreview.style.borderColor =
      objectColor.value;


    drawPreview = null;

    canvasEmpty.style.display =
      "none";

    updateLayers();

    saveHistory();

  }
);


/* =========================================================
   CREATE OBJECTS
========================================================= */

function baseObject(
  x,
  y,
  className,
  name
) {

  const object =
    document.createElement("div");


  object.className =
    `canvas-object ${className}`;


  objectCounter++;


  object.dataset.id =
    `object-${objectCounter}`;


  object.dataset.name =
    name;


  object.style.left =
    `${x}px`;

  object.style.top =
    `${y}px`;


  object.addEventListener(
    "mousedown",
    event => {

      event.stopPropagation();

      selectObject(object);

      enableDragging(
        object,
        event
      );

    }
  );


  designCanvas.appendChild(
    object
  );


  canvasEmpty.style.display =
    "none";


  updateLayers();


  saveHistory();


  return object;

}


function createText(x, y) {

  const textObject =
    baseObject(
      x,
      y,
      "object-text",
      "Metin"
    );


  textObject.textContent =
    currentStudio === "Logo Studio"
      ? "VIOLET"
      : "Yeni Tasarım";


  textObject.style.color =
    objectColor.value;


  selectObject(
    textObject
  );

}


function createRectangle(x, y) {

  const object =
    baseObject(
      x,
      y,
      "object-rectangle",
      "Kare"
    );


  object.style.background =
    objectColor.value;


  selectObject(
    object
  );

}


function createCircle(x, y) {

  const object =
    baseObject(
      x,
      y,
      "object-circle",
      "Daire"
    );


  object.style.background =
    objectColor.value;


  selectObject(
    object
  );

}


/* =========================================================
   SELECT
========================================================= */

function selectObject(object) {

  deselectObject();

  selectedObject = object;

  object.classList.add("selected");


  if (
    object.classList.contains(
      "object-rectangle"
    ) ||
    object.classList.contains(
      "object-circle"
    )
  ) {

    objectColor.value =
      rgbToHex(
        getComputedStyle(object).backgroundColor
      );

  }


  if (
    object.classList.contains(
      "object-text"
    )
  ) {

    objectColor.value =
      rgbToHex(
        getComputedStyle(object).color
      );

  }

}


function deselectObject() {

  document
    .querySelectorAll(
      ".canvas-object.selected"
    )
    .forEach(
      object =>
        object.classList.remove("selected")
    );


  selectedObject = null;

}


/* =========================================================
   DRAGGING
========================================================= */

let dragData = null;


function enableDragging(
  object,
  event
) {

  if (
    currentEditorTool !== "select"
  ) {
    return;
  }


  const rect =
    designCanvas.getBoundingClientRect();


  dragData = {

    object,

    offsetX:
      event.clientX -
      rect.left -
      object.offsetLeft,

    offsetY:
      event.clientY -
      rect.top -
      object.offsetTop

  };

}


window.addEventListener(
  "mousemove",
  event => {

    if (!dragData) return;


    const rect =
      designCanvas.getBoundingClientRect();


    let x =
      event.clientX -
      rect.left -
      dragData.offsetX;


    let y =
      event.clientY -
      rect.top -
      dragData.offsetY;


    x =
      Math.max(
        0,
        Math.min(
          x,
          designCanvas.clientWidth -
          dragData.object.offsetWidth
        )
      );


    y =
      Math.max(
        0,
        Math.min(
          y,
          designCanvas.clientHeight -
          dragData.object.offsetHeight
        )
      );


    dragData.object.style.left =
      `${x}px`;

    dragData.object.style.top =
      `${y}px`;

  }
);


window.addEventListener(
  "mouseup",
  () => {

    if (!dragData) return;

    saveHistory();

    dragData = null;

  }
);


/* =========================================================
   COLOR
========================================================= */

objectColor?.addEventListener(
  "input",
  () => {

    if (!selectedObject) return;


    if (
      selectedObject.classList.contains(
        "object-text"
      )
    ) {

      selectedObject.style.color =
        objectColor.value;

    }

    else if (
      selectedObject.classList.contains(
        "object-draw"
      )
    ) {

      selectedObject.style.borderColor =
        objectColor.value;

    }

    else {

      selectedObject.style.background =
        objectColor.value;

    }

  }
);


objectColor?.addEventListener(
  "change",
  saveHistory
);


/* =========================================================
   CLEAR
========================================================= */

document
  .getElementById("clearCanvas")
  ?.addEventListener(
    "click",
    () => {

      designCanvas
        .querySelectorAll(
          ".canvas-object, .object-draw"
        )
        .forEach(
          object =>
            object.remove()
        );


      selectedObject = null;

      objectCounter = 0;


      canvasEmpty.style.display =
        "flex";


      updateLayers();

      saveHistory();

    }
  );


/* =========================================================
   CENTER
========================================================= */

document
  .getElementById("centerCanvas")
  ?.addEventListener(
    "click",
    () => {

      if (!selectedObject) {

        return;

      }


      selectedObject.style.left =
        `${
          (
            designCanvas.clientWidth -
            selectedObject.offsetWidth
          ) / 2
        }px`;


      selectedObject.style.top =
        `${
          (
            designCanvas.clientHeight -
            selectedObject.offsetHeight
          ) / 2
        }px`;


      saveHistory();

    }
  );


/* =========================================================
   GRID
========================================================= */

document
  .getElementById("toggleGrid")
  ?.addEventListener(
    "click",
    () => {

      designCanvas.classList.toggle(
        "grid-on"
      );

    }
  );


/* =========================================================
   LAYERS
========================================================= */

function updateLayers() {

  if (!layerList) return;


  const objects =
    designCanvas?.querySelectorAll(
      ".canvas-object"
    );


  if (!objects || objects.length === 0) {

    layerList.innerHTML =
      `<span class="layer-empty">
        Henüz obje yok
      </span>`;

    return;

  }


  layerList.innerHTML = "";


  [...objects]
    .reverse()
    .forEach(object => {

      const layer =
        document.createElement("div");


      layer.className =
        "layer-item";


      layer.textContent =
        object.dataset.name ||
        "Obje";


      layer.addEventListener(
        "click",
        () => {

          selectObject(
            object
          );

        }
      );


      layerList.appendChild(
        layer
      );

    });

}


/* =========================================================
   SAVE PROJECT
========================================================= */

document
  .getElementById("saveProjectButton")
  ?.addEventListener(
    "click",
    saveProject
  );


function saveProject() {

  const objects = [];


  designCanvas
    .querySelectorAll(
      ".canvas-object"
    )
    .forEach(object => {

      const computed =
        getComputedStyle(
          object
        );


      objects.push({

        id:
          object.dataset.id,

        name:
          object.dataset.name,

        className:
          object.className,

        text:
          object.textContent,

        left:
          object.style.left,

        top:
          object.style.top,

        width:
          object.style.width,

        height:
          object.style.height,

        color:
          computed.color,

        background:
          computed.backgroundColor

      });

    });


  const project = {

    name:
      projectName?.value ||
      "Yeni Tasarım",

    studio:
      currentStudio,

    objects,

    savedAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "violetStudioProject",
    JSON.stringify(project)
  );


  showToast(
    "Proje kaydedildi."
  );

}


/* =========================================================
   LOAD PROJECT
========================================================= */

document
  .getElementById("loadProjectButton")
  ?.addEventListener(
    "click",
    loadProject
  );


function loadProject() {

  const saved =
    localStorage.getItem(
      "violetStudioProject"
    );


  if (!saved) {

    showToast(
      "Kayıtlı proje bulunamadı."
    );

    return;

  }


  try {

    const project =
      JSON.parse(saved);


    currentStudio =
      project.studio ||
      "Graphic Studio";


    studioTitle.textContent =
      currentStudio;


    studioSubtitle.textContent =
      studioDescriptions[currentStudio] ||
      "Creative Workspace";


    projectName.value =
      project.name ||
      "Yeni Tasarım";


    designCanvas
      .querySelectorAll(
        ".canvas-object, .object-draw"
      )
      .forEach(
        object =>
          object.remove()
      );


    objectCounter = 0;


    project.objects.forEach(data => {

      const object =
        document.createElement("div");


      object.className =
        data.className;


      object.dataset.id =
        data.id;


      object.dataset.name =
        data.name;


      object.textContent =
        data.text;


      object.style.left =
        data.left;

      object.style.top =
        data.top;

      object.style.width =
        data.width;

      object.style.height =
        data.height;


      if (
        data.className.includes(
          "object-text"
        )
      ) {

        object.style.color =
          data.color;

      }

      else {

        object.style.background =
          data.background ||
          data.color;

      }


      objectCounter++;


      object.addEventListener(
        "mousedown",
        event => {

          event.stopPropagation();

          selectObject(object);

          enableDragging(
            object,
            event
          );

        }
      );


      designCanvas.appendChild(
        object
      );

    });


    canvasEmpty.style.display =
      project.objects.length
        ? "none"
        : "flex";


    updateLayers();


    showToast(
      "Proje yüklendi."
    );

  }

  catch {

    showToast(
      "Proje yüklenemedi."
    );

  }

}


/* =========================================================
   EXPORT
========================================================= */

document
  .getElementById("exportButton")
  ?.addEventListener(
    "click",
    exportDesign
  );


function exportDesign() {

  /*
    Buradaki sürüm tarayıcı canvas'ını
    yerel olarak kaydetmek için basit
    bir SVG oluşturur.
  */

  const width =
    designCanvas.clientWidth;

  const height =
    designCanvas.clientHeight;


  const objects =
    [...designCanvas.querySelectorAll(
      ".canvas-object"
    )];


  let svgElements = "";


  objects.forEach(object => {

    const x =
      parseFloat(
        object.style.left
      ) || 0;

    const y =
      parseFloat(
        object.style.top
      ) || 0;


    if (
      object.classList.contains(
        "object-rectangle"
      )
    ) {

      const width =
        object.offsetWidth;

      const height =
        object.offsetHeight;

      const color =
        rgbToHex(
          getComputedStyle(
            object
          ).backgroundColor
        );


      svgElements +=
        `<rect
          x="${x}"
          y="${y}"
          width="${width}"
          height="${height}"
          rx="14"
          fill="${color}"
        />`;

    }


    if (
      object.classList.contains(
        "object-circle"
      )
    ) {

      const size =
        Math.min(
          object.offsetWidth,
          object.offsetHeight
        );


      const color =
        rgbToHex(
          getComputedStyle(
            object
          ).backgroundColor
        );


      svgElements +=
        `<circle
          cx="${x + size / 2}"
          cy="${y + size / 2}"
          r="${size / 2}"
          fill="${color}"
        />`;

    }


    if (
      object.classList.contains(
        "object-text"
      )
    ) {

      const color =
        rgbToHex(
          getComputedStyle(
            object
          ).color
        );


      const fontSize =
        parseInt(
          getComputedStyle(
            object
          ).fontSize
        ) || 32;


      svgElements +=
        `<text
          x="${x + 8}"
          y="${y + fontSize + 8}"
          fill="${color}"
          font-family="Arial"
          font-size="${fontSize}"
          font-weight="700"
        >${escapeXml(
          object.textContent
        )}</text>`;

    }

  });


  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      <rect
        width="100%"
        height="100%"
        fill="#17141d"
      />
      ${svgElements}
    </svg>
  `;


  const blob =
    new Blob(
      [svg],
      {
        type: "image/svg+xml"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    `${
      projectName.value ||
      "violet-project"
    }.svg`;


  link.click();


  URL.revokeObjectURL(url);


  showToast(
    "Tasarım dışa aktarıldı."
  );

}


/* =========================================================
   HISTORY
========================================================= */

function saveHistory() {

  if (!designCanvas) return;


  const snapshot =
    designCanvas.innerHTML;


  historyStack.push(
    snapshot
  );


  if (historyStack.length > 25) {

    historyStack.shift();

  }


  redoStack = [];

}


document
  .getElementById("undoButton")
  ?.addEventListener(
    "click",
    () => {

      if (
        historyStack.length < 2
      ) {

        return;

      }


      const current =
        historyStack.pop();


      redoStack.push(
        current
      );


      const previous =
        historyStack[
          historyStack.length - 1
        ];


      designCanvas.innerHTML =
        previous;


      reconnectCanvasObjects();


      updateLayers();

    }
  );


document
  .getElementById("redoButton")
  ?.addEventListener(
    "click",
    () => {

      if (
        redoStack.length === 0
      ) {

        return;

      }


      const snapshot =
        redoStack.pop();


      historyStack.push(
        snapshot
      );


      designCanvas.innerHTML =
        snapshot;


      reconnectCanvasObjects();


      updateLayers();

    }
  );


function reconnectCanvasObjects() {

  designCanvas
    .querySelectorAll(
      ".canvas-object"
    )
    .forEach(object => {

      object.addEventListener(
        "mousedown",
        event => {

          event.stopPropagation();

          selectObject(
            object
          );

          enableDragging(
            object,
            event
          );

        }
      );

    });

}


/* =========================================================
   UTILITIES
========================================================= */

function rgbToHex(rgb) {

  if (!rgb) return "#8b5cf6";

  if (
    rgb.startsWith("#")
  ) {

    return rgb;

  }


  const values =
    rgb
      .match(
        /\d+/g
      )
      ?.map(Number);


  if (
    !values ||
    values.length < 3
  ) {

    return "#8b5cf6";

  }


  return "#" +
    values
      .slice(0, 3)
      .map(
        value =>
          value
            .toString(16)
            .padStart(2, "0")
      )
      .join("");

}


function escapeXml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  let toast =
    document.getElementById(
      "violetToast"
    );


  if (!toast) {

    toast =
      document.createElement("div");


    toast.id =
      "violetToast";


    toast.style.position =
      "fixed";


    toast.style.left =
      "50%";


    toast.style.bottom =
      "28px";


    toast.style.transform =
      "translateX(-50%)";


    toast.style.zIndex =
      "2000";


    toast.style.padding =
      "12px 18px";


    toast.style.border =
      "1px solid rgba(167,139,250,.25)";


    toast.style.borderRadius =
      "10px";


    toast.style.background =
      "rgba(17,13,24,.95)";


    toast.style.color =
      "#ddd6fe";


    toast.style.fontSize =
      "11px";


    toast.style.boxShadow =
      "0 20px 60px rgba(0,0,0,.45)";


    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.style.opacity =
    "1";


  clearTimeout(
    toast._timeout
  );


  toast._timeout =
    setTimeout(
      () => {

        toast.style.opacity =
          "0";

      },
      2200
    );

}


/* =========================================================
   INITIAL HISTORY
========================================================= */

setTimeout(
  () => {

    if (designCanvas) {

      saveHistory();

    }

  },
  100
);
