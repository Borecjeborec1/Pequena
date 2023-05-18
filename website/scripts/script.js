const appWindows = document.querySelectorAll(".application")
const appTops = document.querySelectorAll(".title-bar")
const pequenaDocs = document.querySelector('#pequena-docs');
const navBar = document.querySelector('.navBar');
const codeBlocks = document.querySelectorAll('pre code');

let pos1 = 0
let pos2 = 0
let pos3 = 0
let pos4 = 0
let windowId = 0
let isMouseDown = false

const LEFT_TRESHOLD = -50
const SMALL_WINDOW = { width: "900px", height: "600px" }

const VERSION = "1.0.1"
const INSTALL_MAP = {
  "bash": "$ sh <(curl some_link)",
  "npm": "$ npm i pequena",
  "git": "$ git clone some_link",
  "yarn": "$ yarn add pequena",
  "pnpm": "$ pnpm i pequena",
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


function selectedLi(el) {
  document.getElementById("installList").querySelector(".selected").classList.remove("selected")
  el.classList.add("selected")
  document.getElementById("installCodeBlock").textContent = INSTALL_MAP[el.textContent]
  hljs.highlightElement(document.getElementById("installCodeBlock"));
}


function clickedNavBar(el) {
  console.log(el)
  let nested = el.querySelector(".nestedList")
  let newDocs = document.getElementById(el.dataset.section)
  let isOnlyClosing = el.querySelector(".name").classList.contains("active")
  document.querySelectorAll(".docs-section").forEach(el => el.style.display = "none")
  document.querySelectorAll(".nestedList").forEach(el => el.style.display = "none")
  newDocs.style.display = "block"
  el.parentNode.parentNode.parentNode.scrollTo({ top: 100, left: 100, behavior: 'smooth' })
  document.querySelectorAll(".active").forEach(el => el.classList.remove("active"))
  if (isOnlyClosing)
    return
  el.querySelector(".name").classList.add("active")
  nested.style.display = "block"
}

function clickedNestedNavBar(el) {
  let nested = el.querySelector(".nestedList")
  el.querySelector(".name").classList.add("active")
  nested.style.display = "block"
}

function moveToSection(parentNode, el) {
  parentNode.querySelectorAll(".nestedList .active").forEach(el => el.classList.remove("active"))
  el.classList.add("active")
  let sectionName = parseString(parentNode.querySelector('.name').textContent)
  let headingName = parseString(el.textContent)
  console.log(sectionName, headingName)
  document.getElementById(sectionName).querySelector("#" + headingName).scrollIntoView({
    behavior: 'smooth'
  })
}


function handleCopyBlocks() {
  function copyCode(event) {
    let codeBlock = event.target.parentElement;
    let codeText = codeBlock.textContent;

    navigator.clipboard.writeText(codeText).then(() => {
      event.target.className = "copy-icon  fas fa-check copied ";

      setTimeout(() => {
        event.target.className = "copy-icon  far fa-copy";
      }, 2000);
    }).catch(() => {
      console.error('Failed to copy code.');
    });
  }

  codeBlocks.forEach((codeBlock) => {
    let copyIcon = document.createElement('i');
    copyIcon.className += 'copy-icon far fa-copy ';
    copyIcon.addEventListener('click', copyCode);

    codeBlock.parentElement.insertBefore(copyIcon, codeBlock.nextSibling);
  });
}



function parseString(_str) {
  return _str.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/ /g, "-")
}


function updateClock() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  if (hours < 10) {
    hours = '0' + hours;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  let timeString = hours + ':' + minutes + ':' + seconds;
  document.getElementById('clock').textContent = timeString;
}


function handleDocsSize() {
  function outputsize() {
    if (+pequenaDocs.style.width.replace("px", "") < 900 && +pequenaDocs.style.width.replace("px", "") != 0)
      navBar.style.display = "none"
    else
      navBar.style.display = "block"
  }

  new ResizeObserver(outputsize).observe(pequenaDocs)
}

window.onload = main

function main() {
  updateClock()
  setInterval(updateClock, 1000);
  document.querySelectorAll(".versioning").forEach(e => e.textContent = VERSION)
  handleDocsSize()
  handleCopyBlocks()
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

  document.addEventListener("mouseshake", function (e) {
    if (isMouseDown)
      for (let i = 0; i < appWindows.length; ++i) {
        if (i !== windowId)
          appWindows[i].style.display = "none"
      }
  });
}


/**
 * Main color: #FF5A5F (a bright and energetic red)
 * Background color: #1E1E1E (a deep and rich black)
 * Accent color: #FFB948 (a warm and inviting yellow)
 * Text color: #FFFFFF (a crisp and clean white)
 * 
 * Secondary color: #00A699 (a cool and refreshing teal)
 * Neutral color 1: #D5D5D5 (a light and subtle gray)
 * Neutral color 2: #9B9B9B (a darker and more pronounced gray)
 */