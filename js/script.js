let deleteActivated = false;

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

        for (let ele of document.getElementsByClassName('player')) {
            ele.removeAttribute('id');
        } 

        ele.setAttribute('id', 'focus');        
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
        document.ontouchend    = null;
        document.ontouchmove   = null;
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
        let newP = document.createElement('div');
        
        newP.setAttribute('class', 'player');
        dragElement(newP);

        let newC = document.createElement('div');
        newC.setAttribute('class', 'circleBase');
        
        // Add name input
        let newIn = document.createElement('input');
        newIn.setAttribute('maxlength', maxLength);
        newIn.setAttribute('value', 'name');
        newC.appendChild(newIn);
        
        // Add power input
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id', 'powerLevel');

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
        let gender = Math.random() >= 0.5 ? 'male' : 'female';
        newIn.setAttribute('value', gender);
        newC.appendChild(newIn);

        newP.appendChild(newC);

        return newP;
    }
}

function changePower(ele, value) {
    let newEle = ele.parentElement;
    
    for (const element of newEle.getElementsByTagName('input')) {
        let eleValue = parseInt(element.getAttribute('value'));
        eleValue += value;
        element.setAttribute('value', eleValue);
    }
}

function toggleDelete() {
    const borderStyle = '2px solid red';
    deleteActivated = !deleteActivated;
    document.getElementById('removePlayer').style.border = ( deleteActivated ) ? borderStyle : null;
}