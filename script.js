/* = Мусорка =========================================== *\
-[ ] Ивенты вынести отдельно ай гуесс
\* ===================================================== */

let map_width = 800;
let map_height = 600;

data = {
    "r101": {
        "name": "Sus"
    },
    "r102": {
        "name": "Amogus"
    }
}



/* = Перемещение карты ================================= *\
\* ===================================================== */

$( function() {
    $('#map').draggable(
        { scroll: false }
    )
});

/* = Масштабирование карты ============================= *\
\* ===================================================== */

const min_zoom = 1;
const max_zoom = 2.5;
const step_zoom = 0.25;
let current_zoom = 1;

let scroll_timeout = false;

const canvas = document.getElementById('canvas');
const map = document.getElementById('map');
canvas.addEventListener('wheel', event => {
    if (scroll_timeout == true) { return; }
    
    let direction = event.deltaY > 0 ? -1 : 1;

    if (event.shiftKey == true) {
        if (direction > 0) { upFloor(); }
        if (direction < 0) { downFloor(); }
        scroll_timeout = true;
        setTimeout(() => { scroll_timeout = false; }, 200);
        return;
    }

    let new_zoom = current_zoom + direction * step_zoom;

    if (new_zoom < min_zoom) { zoom(min_zoom); return; }
    if (new_zoom > max_zoom) { zoom(max_zoom); return; }
    zoom(new_zoom);
});

function zoom(new_zoom) {
    current_zoom = new_zoom;
    map.style.transform = 'scale('+current_zoom+')';
}

/* = Выбор комнаты ===================================== *\
\* ===================================================== */

let selected = '';

const delta = 6;
let start_x;
let start_y;

document.body.addEventListener('mousedown', event => {
    start_x = event.pageX;
    start_y = event.pageY;
})

map.addEventListener('mouseup', event => {
    let diffX = Math.abs(event.pageX - start_x);
    let diffY = Math.abs(event.pageY - start_y);
    if (diffX < delta && diffY < delta) {
        deselect();
        console.log("- deselected -");
    }
})

const rooms = document.querySelectorAll('.room');
rooms.forEach((room) => {
    room.addEventListener('mouseup', event => {
        let diffX = Math.abs(event.pageX - start_x);
        let diffY = Math.abs(event.pageY - start_y);
        if (diffX < delta && diffY < delta) {
            select(event);
        }
    })
    room.addEventListener('keyup', event => {
        if (event.key == 'Enter') {
            select(event);
        }
    });
});


function deselect() {
    if (selected) {
        document.getElementById(selected).classList.remove('selected');
    }
}

function select(event) {
    deselect();
    selected = event.currentTarget.id;
    document.getElementById(selected).classList.add('selected');
    
    //TODO сделать вывод информации!!!
    console.log(data[selected]['name']);
}

/* = Переключение этажа ================================ *\
\* ===================================================== */

let current_floor = 1;

let min_floor = 1;
let max_floor = 4;

document.addEventListener('keydown', event => {
    if (event.key == "ArrowUp") { upFloor(); }
    if (event.key == "ArrowDown") { downFloor(); }
})

function upFloor() { 
    next_floor = current_floor + 1;
    if (max_floor < next_floor) { return; }
    changeFloor(next_floor);
}

function downFloor() {
    next_floor = current_floor - 1;
    if (next_floor < min_floor) { return; }
    changeFloor(next_floor);
}

function changeFloor(next_floor) {
    let current = document.getElementById('f'+current_floor);
    let next = document.getElementById('f'+next_floor);

    if (next_floor > current_floor) {
        current.classList.add('reverse');
        next.classList.add('reverse');
    }
    else {
        current.classList.remove('reverse');
        next.classList.remove('reverse');
    }

    current.classList.add('hide');
    next.classList.remove('hide');

    current_floor = next_floor;
}

// fetch('http://localhost/api/info?room=')
//     .then((response) => response.json())
//     .then((json) => console.log(json));