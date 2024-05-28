/* = Мусорка =========================================== *\
-[ ] Ивенты вынести отдельно ай гуесс
\* ===================================================== */

const urlParams = new URLSearchParams(window.location.search);

let data = {}
data = json;

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];


const canvas = document.getElementById('canvas');
const map = document.getElementById('map');
const map_width = parseInt(map.style.width);
const map_height = parseInt(map.style.height);

/* = Перемещение карты ================================= *\
\* ===================================================== */

$( function() {
    $('#map').draggable(
        { scroll: false }
    )
});

function goToRoom(room_id) {
    let room = document.getElementById(room_id)

    let x = room.children[1].getAttribute("x");
    let y = room.children[1].getAttribute("y");

    let floor = parseInt(room.parentElement.id[1])
    changeFloor(floor)
    map.style.left = (map_width/2 - x)+'px';
    map.style.top = (map_height/2 - y)+'px';
}

/* = Масштабирование карты ============================= *\
\* ===================================================== */

const min_zoom = 1;
const max_zoom = 2.5;
const step_zoom = 0.25;
let current_zoom = 1;

let scroll_timeout = false;

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

const info = document.getElementById('info');
const info_img = document.getElementById('info_img');
const info_name = document.getElementById('info_name');
const info_desc = document.getElementById('info_desc');
const delta = 6;
let start_x;
let start_y;
let block = false

document.body.addEventListener('mousedown', event => {
    start_x = event.pageX;
    start_y = event.pageY;
})

map.addEventListener('mouseup', event => {
    let diffX = Math.abs(event.pageX - start_x);
    let diffY = Math.abs(event.pageY - start_y);
    if (diffX < delta && diffY < delta) {
        deselect();
    }
});

const rooms = document.querySelectorAll('.room');
rooms.forEach((room) => {
    room.addEventListener('mouseup', event => {
        let diffX = Math.abs(event.pageX - start_x);
        let diffY = Math.abs(event.pageY - start_y);
        if (diffX < delta && diffY < delta) {
            select(event.currentTarget);
        }
    })
});

function deselect() {
    if (!block) {
        document.querySelectorAll('.selected').forEach(element => {
            element.classList.remove('selected');
        });
        info.style.display = 'none';
    }
    block = false;
}

function select(room) {
    deselect();
    room.classList.add('selected');
    loadInfo(room.id)
    info.style.display = 'block';
    block = true;
    // document.getElementById(selected).classList.add('selected');
    
    //TODO сделать вывод информации!!!
    // console.log(data[selected]['name']);
}

function loadInfo(room) {
    if (room) {
        if (data[room].img) {
            info_img.src = 'img/room/'+data[room].img;
        }
        info_name.innerText = data[room].name;
        info_desc.innerHTML = data[room].desc;
    }
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

/* = Поиск этажа ======================================= *\
\* ===================================================== */

const search = document.getElementById('search')
const suggestions = document.getElementById('suggestions');

function findRoom() {
    const query = search.value.toLowerCase();
    if (query == '') {
        suggestions.innerHTML = '';
        return;
    }
    const results = Object.values(data).filter( value =>
        value.name.toLowerCase().indexOf(query) >= 0
    );
    updateResults(results);
}

function updateResults(results) {
    suggestions.innerHTML = '';
    results.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.textContent = room.name;
        roomElement.className = 'suggestion';
        roomElement.onclick = () => selectRoom(room.name);
        suggestions.appendChild(roomElement);
    });
}

/* = Закладки ========================================== *\
\* ===================================================== */

const bookmarks_list = document.getElementById('bookmarks');

function addBookmark() {
    const room = document.querySelector('.selected').id;
    if (room && !bookmarks.includes(room)) {
        bookmarks.push(room);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        updateBookmarks();
    }
}

function updateBookmarks() {
    bookmarks_list.innerHTML = '';
    bookmarks.forEach(item => {
        const bookmark = document.createElement('div');
        bookmark.textContent = data[item].name;
        bookmark.className = 'bookmark';
        bookmark.onclick = () => {
            deselect()
            select(document.getElementById(item))
            goToRoom(item)
        };
        bookmarks_list.appendChild(bookmark);

    });
}

/* = Пост ============================================== *\
\* ===================================================== */

linked_room = urlParams.get('room')
if (linked_room) {
    goToRoom(linked_room);
}

updateBookmarks()