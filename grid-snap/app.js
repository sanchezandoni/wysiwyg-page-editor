const gridSize = 32;
const sensibility = 8;

var el1 = document.getElementById("el1");
var el = document.getElementById("el2");

el1.style.left = `${el1.getAttribute("data-x") * gridSize}px`;
el1.style.top = `${el1.getAttribute("data-y") * gridSize}px`;
el1.style.width = `${el1.getAttribute("data-width") * gridSize}px`;
el1.style.height = `${el1.getAttribute("data-height") * gridSize}px`;


el2.style.left = `${el2.getAttribute("data-x") * gridSize}px`;
el2.style.top = `${el2.getAttribute("data-y") * gridSize}px`;
el2.style.width = `${el2.getAttribute("data-width") * gridSize}px`;
el2.style.height = `${el2.getAttribute("data-height") * gridSize}px`;

/*
DARG EVENTS

Event   On Event Handler  Description
drag    ondrag        Fired when an element or text selection is being dragged.
dragend   ondragend     Fired when a drag operation is being ended (for example, by releasing a mouse button or hitting the escape key). (See Finishing a Drag.)
dragenter ondragenter     Fired when a dragged element or text selection enters a valid drop target. (See Specifying Drop Targets.)
dragexit  ondragexit      Fired when an element is no longer the drag operation's immediate selection target.
dragleave ondragleave     Fired when a dragged element or text selection leaves a valid drop target.
dragover  ondragover      Fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
dragstart ondragstart     Fired when the user starts dragging an element or text selection. (See Starting a Drag Operation.)
drop    ondrop        Fired when an element or text selection is dropped on a valid drop target. (See Performing a Drop.)
*/

// Make the DIV element draggable:
//https://www.w3schools.com/howto/howto_js_draggable.asp
makeDragable(el1);
makeDragable(el2);
function makeDragable(elmnt) {
  var mouseDiffX = 0,
      mouseDiffY = 0,
      startupMouseX = 0,
      startupMouseY = 0,
      elementVirtualX = 0,
      elementVirtualY = 0;

  elmnt.addEventListener("mousedown",dragMouseDown);

  function dragMouseDown(e) {
    e = e || window.event;
    if ( mouseOverResizingTool(e) ) return true;

    e.preventDefault();
    // get the mouse cursor position at startup:
    startupMouseX = e.clientX;
    startupMouseY = e.clientY;
    elementVirtualX = elmnt.offsetLeft;
    elementVirtualY = elmnt.offsetTop;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    mouseDiffX = startupMouseX - e.clientX;
    mouseDiffY = startupMouseY - e.clientY;
    startupMouseX = e.clientX;
    startupMouseY = e.clientY;
    // set the element's new position:
    elementVirtualY -= mouseDiffY;
    elementVirtualX -= mouseDiffX;
    elmnt.style.top = snapToGrip(elementVirtualY, gridSize, sensibility) + "px";
    elmnt.style.left = snapToGrip(elementVirtualX, gridSize, sensibility) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


makeResizable(el1);
makeResizable(el2);
function makeResizable(elmnt) {

  var mouseDiffX = 0,
      mouseDiffY = 0,
      startupMouseX = 0,
      startupMouseY = 0,
      elementVirtualWidth = 0,
      elementVirtualHeight = 0;
    
  elmnt.addEventListener("mousedown",resizeMouseDown);

  function resizeMouseDown(e){
    e = e || window.event;

    if ( !mouseOverResizingTool(e) ) return true;
    e.preventDefault();
    // get the mouse cursor position at startup:
    startupMouseX = e.clientX;
    startupMouseY = e.clientY;
    elementVirtualWidth = elmnt.offsetWidth;
    elementVirtualHeight = elmnt.offsetHeight;
    document.onmouseup = closeResizeElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementResize;
  }

  function elementResize(e){
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    mouseDiffX = startupMouseX - e.clientX;
    mouseDiffY = startupMouseY - e.clientY;
    startupMouseX = e.clientX;
    startupMouseY = e.clientY;
    // set the element's new size:
    elementVirtualHeight -= mouseDiffY;
    elementVirtualWidth -= mouseDiffX;

    // For snapping right and bottom borders to grid
    elmnt.style.width = snapToGrip(elmnt.offsetLeft + elementVirtualWidth, gridSize, sensibility)-elmnt.offsetLeft + "px";
    elmnt.style.height = snapToGrip(elmnt.offsetTop + elementVirtualHeight, gridSize, sensibility)-elmnt.offsetTop + "px";

    // For snapping box size to grid size
    /*
    elmnt.style.width = snapToGrip(elementVirtualWidth, gridSize, sensibility) + "px";
    elmnt.style.height = snapToGrip(elementVirtualHeight, gridSize, sensibility) + "px";
    */
  }

  function closeResizeElement(e){
    document.onmouseup = null;
    document.onmousemove = null;
  }

}

function mouseOverResizingTool(e){
  const RESIZING_TOOL_SIZE = 6;
  return (e.target.offsetWidth - e.offsetX < RESIZING_TOOL_SIZE) && (e.target.offsetHeight - e.offsetY < RESIZING_TOOL_SIZE);
}

function snapToGrip(val,gridSize,sensibility=null){
    var snap_candidate = gridSize * Math.round(val/gridSize);
    if ( sensibility === null ){
    return snap_candidate
    }

    if (Math.abs(val-snap_candidate) < sensibility) {
        return snap_candidate;
    }
    else {
        return val;
    }
};