let deleteActivated = false;

// Credit goes to https://www.w3schools.com/howto/howto_js_draggable.asp for the dragElement function.
function dragElement(ele) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    ele.onmousedown = dragMouseDown;

    function dragMouseDown(e) {

        // delete element if 
        if (deleteActivated) {
            ele.parentElement.removeChild(ele);
            return;
        }

        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

        for (let ele of document.getElementsByClassName('player')) {
            ele.removeAttribute('id');
        } 

        ele.setAttribute('id', 'focus');
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        ele.style.top = (ele.offsetTop - pos2) + 'px';
        ele.style.left = (ele.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
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
        newIn = document.createElement('input');
        newIn.setAttribute('maxlength', maxLength);
        newIn.setAttribute('value', '1');
        newC.appendChild(newIn);

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

function toggleDelete() {
    deleteActivated = !deleteActivated;

    if (deleteActivated) {
        document.getElementById('removePlayer').style.border = '2px solid red'
    } else {
        document.getElementById('removePlayer').style.border = '';
    }
}