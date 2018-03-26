let deleteActivated = false;
let playerBubble;

loadJSON('json/player.json', x => playerBubble = x);

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
    
    let newPlayer = createNewPlayer();
    newPlayer.style.left = (Math.random()*65) + 5 + '%';
    newPlayer.style.top =  (Math.random()*65) + 5 + '%'; 

    ele.appendChild(newPlayer);

    function createNewPlayer(x, y) {
        let newP;

        if (playerBubble)
            newP = parseElement(playerBubble);
        else
            newP = getPlayerBubble();
        
        dragElement(newP);
        return newP;
    }

    function parseElement(ele) {
        let eleConfig = JSON.parse(ele);
        
        let newEle = parseNode(eleConfig['elements'][0]);
        return newEle;
    }
    
    function parseNode(node) {
        let mainNode = document.createElement(node['tagName']);
    
        let attrConfig = node['attributes'];
        for (let attr in attrConfig) {
            mainNode.setAttribute(attr, attrConfig[attr])
        }
        
        let eleConfig = node['elements'];
        let eleNode;
        for (let ele in eleConfig) {
            eleNode = parseNode(eleConfig[ele]);
            mainNode.appendChild(eleNode);
        }
        return mainNode;
    }    

    function getPlayerBubble() {
        let newP = document.createElement('div');
        newP.setAttribute('class', 'player');
    
        let newC = document.createElement('div');
        newC.setAttribute('class', 'circleBase');
        
        // Add name input
        let newIn = document.createElement('input');
        newIn.setAttribute('maxlength', maxLength);
        newIn.setAttribute('value', 'name');
        newIn.setAttribute('type', 'text');
        newIn.setAttribute('onchange', 'testForSpecialName(this);')
        newC.appendChild(newIn);
        
        // Add power input
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id', 'numbers');
    
        // add left arrow image
        let newImg = document.createElement('img');
        newImg.setAttribute('src', 'media/left_arrow.svg');
        newImg.setAttribute('alt', '<-');
        newImg.setAttribute('onclick', 'changePower(this, -1);')
        newDiv.appendChild(newImg);
    
        // the actual input
        newIn = document.createElement('input');
        newIn.setAttribute('maxlength', maxLength);
        newIn.setAttribute('value', '1');
        newDiv.appendChild(newIn);
    
        // add left arrow image
        newImg = document.createElement('img');
        newImg.setAttribute('src', 'media/right_arrow.svg');
        newImg.setAttribute('alt', '->');
        newImg.setAttribute('onclick', 'changePower(this, 1);')
        newDiv.appendChild(newImg);
    
        newC.appendChild(newDiv);
    
        // Add gender input
        newIn = document.createElement('input');
        newIn.setAttribute('maxlength', maxLength);
        newIn.setAttribute('value', 'gender');
        newIn.setAttribute('onchange', 'testForSignal(this);');
        newC.appendChild(newIn);
    
        newC.setAttribute('id', 'none');
        newP.appendChild(newC);
    
        return newP;
    }    
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

function loadJSON(file, callback) {   
    let xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}