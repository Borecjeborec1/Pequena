const appWindows = document.querySelectorAll(".application")
const appTops = document.querySelectorAll(".title-bar")

let pos1 = 0
let pos2 = 0
let pos3 = 0
let pos4 = 0
let windowId = 0
let storedPos = []

const LEFT_TRESHOLD = -50
const SHAKE_DURATION_TRESHOLD = 250
const SHAKE_TRESHOLD = 100

for (let i = 0; i < appTops.length; ++i) {
  appTops[i].addEventListener("mousedown", e => {
    windowId = i
    bringWindowToFront(appWindows[windowId])
    dragMouseDown(e)
  })
}
function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  storedPos.push(pos3)
  if (e.clientY < 1) return
  if (+appWindows[windowId].style.left.replace("px", "") < LEFT_TRESHOLD) {
    appWindows[windowId].style.left = `${LEFT_TRESHOLD + 1}px`
  }
  if (storedPos.length > SHAKE_DURATION_TRESHOLD) {
    let average = storedPos.reduce((a, b) => a + b) / storedPos.length
    let min = Math.min.apply(Math, storedPos);
    let max = Math.max.apply(Math, storedPos);
    if (average - min < SHAKE_TRESHOLD && max - average < SHAKE_TRESHOLD) {
      for (let i = 0; i < appWindows.length; ++i) {
        if (i !== windowId)
          appWindows[i].style.display = "none"
      }
    }
    storedPos = []
  }
  appWindows[windowId].style.top = (appWindows[windowId].offsetTop - pos2) + "px";
  appWindows[windowId].style.left = (appWindows[windowId].offsetLeft - pos1) + "px";
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
  storedPos = []
}

function openWindow(el) {
  let windowName = el.replace("-icon", "")
  console.log(windowName)
  let window = document.getElementById(windowName)
  window.addEventListener("click", (e) => {
    console.log("clicked")
    bringWindowToFront(window);
  });
  if (window.style.display == "none" || !window.style.display) {
    window.style.display = "flex"
    bringWindowToFront(window);
  } else {
    window.style.display = "none"
  }
}


function bringWindowToFront(window) {
  let maxZIndex = 0;
  for (let i = 0; i < appWindows.length; ++i) {
    if (appWindows[i] === window) {
      appWindows[i].style.zIndex = appWindows.length;
    } else {
      appWindows[i].style.zIndex = i + 1;
    }
    maxZIndex = Math.max(maxZIndex, appWindows[i].style.zIndex);
  }
  window.style.zIndex = maxZIndex + 1;
}