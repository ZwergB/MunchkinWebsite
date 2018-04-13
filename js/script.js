let deleteActivated = false;

// This constant is used, when the script is not able to load the partial player bubble. Is shouldn't be used all the time.
const oldBubble = '<div class="player focus"> <div class="circleBase none"> <input maxlength="20" value="name" onchange="testForSpecialName(this)"> <div id="numbers"><img src="media/left_arrow.svg" alt="left" onclick="changePower(this, -1);" class="clickElement"> <input maxlength="20" value="1"><img src="media/right_arrow.svg" alt="right" onclick="changePower(this, 1);" class="clickElement"></div> <div id="numbers"><img src="media/left_arrow.svg" alt="left" onclick="changePower(this, -1);" class="clickElement"> <input maxlength="20" value="1"><img src="media/right_arrow.svg" alt="right" onclick="changePower(this, 1);" class="clickElement"></div> <input maxlength="20" value="gender" onchange="testForSignal(this);"> </div> </div>';

const partialBubbleName = 'bubble.html';
let playerBubble;

loadPartial(partialBubbleName, 
            function(result) {
                var xmlString = result,
                    parser    = new DOMParser(),
                    doc = parser.parseFromString(xmlString, "text/html");
                
                playerBubble = doc.body.firstChild;
            });

function loadPartial(name, func) {
    const path = '/partials/';

    var request = new XMLHttpRequest();
    request.open('GET', path + name, true);
    
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            func(request.responseText);
        } else {
            func(oldBubble)    
        }
    };
    
    if ( !request.send() ) 
        func(oldBubble);
}

// Credit goes to https://www.w3schools.com/howto/howto_js_draggable.asp for the dragElement function.
function dragElement(ele) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    ele.onmousedown  = dragMouseDown;
    ele.ontouchstart = dragTouchDown;

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup   = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementMouseDrag;
        dragDown();
    }

    function dragTouchDown(e) {
        e = e || window.event;
        
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        document.ontouchend  = closeDragElement;
        document.ontouchmove = elementTouchDrag;

        dragDown();
    }

    function dragDown() {

        // delete element if deleteActivated
        if (deleteActivated) {
            ele.parentElement.removeChild(ele);
            return;
        }

        for (let element of document.getElementsByClassName('player')) {
            element.classList.remove('focus');
        } 

        ele.classList.add('focus');        
    }

    function elementMouseDrag(e) {
        e = e || window.event;
        let pos = {x: e.clientX, y: e.clientY};
        elementDrag(pos);
    }

    function elementTouchDrag(e) {
        e = e || window.event;
        let pos = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        elementDrag(pos);
    }    


    function elementDrag(pos) {
        // calculate the new cursor position:
        pos1 = pos3 - pos.x;
        pos2 = pos4 - pos.y;
        pos3 = pos.x;
        pos4 = pos.y;
        // set the element's new position:
        ele.style.top = (ele.offsetTop - pos2) + 'px';
        ele.style.left = (ele.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup   = null;
        document.onmousemove = null;
        document.ontouchend  = null;
        document.ontouchmove = null;
    }
}

function addPlayer() {
    const maxLength = 20;

    let ele = document.getElementById('players');
    
    let newPlayer = playerBubble.cloneNode(true);
    dragElement(newPlayer);

    newPlayer.style.left = (Math.random()*65) + 5 + '%';
    newPlayer.style.top =  (Math.random()*65) + 5 + '%'; 

    ele.appendChild(newPlayer);
}

function changePower(ele, value) {
    let newEle = ele.parentElement;
    
    for (const element of newEle.getElementsByTagName('input')) {
        let eleValue = parseInt(element.value);
        eleValue += value;
        element.value = eleValue;
    }
}

function toggleDelete() {
    deleteActivated = !deleteActivated;

    if (deleteActivated) 
        document.getElementById('removePlayer').classList.add('activeButton');
    else
        document.getElementById('removePlayer').classList.remove('activeButton');
}

function testForSignal(ele) {
    let eleValue = ele.value;
    if ( eleValue == 'male' || eleValue == 'm' ) {
        ele.parentElement.setAttribute('id', 'male');
    } else if ( eleValue == 'female' || eleValue == 'f' ) {
        ele.parentElement.setAttribute('id', 'female');
    } else {
        ele.parentElement.setAttribute('id', 'none');
    }
}

// Just for fun function
function testForSpecialName(ele) {
    let eleValue = ele.value;
    if ( eleValue == 'zwergb' ) 
        ele.parentElement.classList.add('specialName')
    else 
        ele.parentElement.classList.remove('specialName');
}