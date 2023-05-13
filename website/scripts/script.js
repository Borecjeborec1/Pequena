const appWindows = document.querySelectorAll(".application")
const appTops = document.querySelectorAll(".title-bar")

let pos1 = 0
let pos2 = 0
let pos3 = 0
let pos4 = 0
let windowId = 0
let isMouseDown = false

const LEFT_TRESHOLD = -50
const SMALL_WINDOW = { width: "900px", height: "600px" }

for (let i = 0; i < appTops.length; ++i) {
  appTops[i].addEventListener("mousedown", e => {
    windowId = i
    bringWindowToFront(appWindows[windowId])
    dragMouseDown(e)
  })
  appWindows[i].addEventListener("click", (e) => {
    bringWindowToFront(appWindows[i]);
  });
}
function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  pos3 = e.clientX;
  pos4 = e.clientY;
  isMouseDown = true
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;
}

document.addEventListener("mouseshake", function (e) {
  if (isMouseDown)
    for (let i = 0; i < appWindows.length; ++i) {
      if (i !== windowId)
        appWindows[i].style.display = "none"
    }
});
function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  if (e.clientY < 1) {
    maximizeWindow(appWindows[windowId])
    return
  }
  if (+appWindows[windowId].style.left.replace("px", "") < LEFT_TRESHOLD) {
    appWindows[windowId].style.left = `${LEFT_TRESHOLD + 1}px`
    return
  }


  appWindows[windowId].style.top = (appWindows[windowId].offsetTop - pos2) + "px";
  appWindows[windowId].style.left = (appWindows[windowId].offsetLeft - pos1) + "px";
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
  isMouseDown = false
}

function openWindow(el) {
  let winDiv = document.getElementById(el)

  if (winDiv.style.display == "none" || !winDiv.style.display) {
    winDiv.style.display = "flex"
    bringWindowToFront(winDiv);
  } else {
    winDiv.style.display = "none"
  }
}


function bringWindowToFront(winDiv) {
  let maxZIndex = 0;
  for (let i = 0; i < appWindows.length; ++i) {
    if (appWindows[i] === winDiv) {
      appWindows[i].style.zIndex = appWindows.length;
    } else {
      appWindows[i].style.zIndex = i + 1;
    }
    maxZIndex = Math.max(maxZIndex, appWindows[i].style.zIndex);
  }
  winDiv.style.zIndex = maxZIndex + 1;
}

function closeWindow(el) {
  let winDiv = document.getElementById(el)
  winDiv.style.zIndex = 1;
  winDiv.style.display = "none"
}
function maximizeWindow(el) {
  let winDiv = typeof el === "string" ? document.getElementById(el) : el
  if (!winDiv.classList.contains("maximized") || winDiv === el) {
    winDiv.style.width = window.innerWidth + "px"
    winDiv.style.height = window.innerHeight + "px"
    winDiv.style.top = "50%"
    winDiv.style.left = "50%"
    winDiv.classList.add("maximized")
  } else {
    winDiv.style.width = SMALL_WINDOW.width
    winDiv.style.height = SMALL_WINDOW.height
    winDiv.classList.remove("maximized")
  }
}

const INSTALL_MAP = {
  "bash": "$ sh <(curl https://create.tauri.app/sh)",
  "npm": "$ npm i pequena",
  "git": "$ git clone some_repo",
  "yarn": "$ yarn add pequena",
  "pnpm": "$ pnpm i pequena",
}

function selectedLi(el) {
  document.getElementById("installList").querySelector(".selected").classList.remove("selected")
  el.classList.add("selected")
  document.getElementById("installCodeBlock").textContent = INSTALL_MAP[el.textContent]
  hljs.highlightAll();
}


function clickedNavBar(el) {
  let nested = el.querySelector(".nestedList")
  el.querySelector(".name").classList.toggle("active")
  if (nested.style.display != "none")
    nested.style.display = "none"
  else
    nested.style.display = "block"
}

function moveToSection(sectionName, el) {
  el.classList.toggle("active")
  sectionName = parseString(sectionName)
  let headingName = parseString(el.textContent)
  console.log(sectionName, headingName)
  document.getElementById(sectionName).querySelector("#" + headingName).scrollIntoView({
    behavior: 'smooth'
  })
}

function parseString(_str) {
  return _str.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/ /g, "-")
}