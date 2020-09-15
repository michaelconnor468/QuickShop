window.addEventListener('load', (event)=>setup(event) );
// Lists are cached to reduce number of requests to server as any conflicts from synchronous use are handled on the server side
let ListBuffer = []
let ListNames = ['grocery', 'household']

function setup(event) {
    document.getElementById('nav_grocery_logo').addEventListener('click', () => showList('grocery'));
    document.getElementById('nav_grocery_logo').addEventListener('keydown', () => showList('grocery')); 
    document.getElementById('nav_household_logo').addEventListener('click', () => showList('household'));
    document.getElementById('nav_household_logo').addEventListener('keydown', () => showList('household')); 
    document.getElementById('header_logo').addEventListener('click', () => location.reload());
    document.getElementById('header_logo').addEventListener('keydown', () => location.reload()); 
    
    // Initializes each list and the gui count displays on main page
    updateListBuffer(() => {
        ListBuffer.forEach((list) => {  
            if ( list.items.length != 0 && ListNames.includes(list.name) ) 
                document.getElementById(`nav_${list.name}_amount`).innerHTML = list.items.length; 
            });
    });  
}

// Switches body of webpage to corresponding list through a gentle gradiant fade
// doing so instead of switching pages provides for a smoother user experience
function showList(list) {
    let body = document.getElementById("main_body");
    body.style.transition = 'opacity '+0.4+'s ease';
    body.style.opacity = 0;
    window.setTimeout(function() {
        writeListHTML(body, list);
        window.scrollTo(window.scrollX, 0);
        window.setTimeout( function() {body.style.opacity = 1;}, 100); // Timeout necessary here to prevent flicker
    }, 400);
}

function writeListHTML(body, shoppinglist) {
    body.innerHTML = '';
    let htmlList = document.createElement("UL"); 
    htmlList.className = 'itemlist';
    body.appendChild(htmlList);
    // Html structure kept in separate file as creating these in pure js made for hard to understand and modify code
    fetch('pages/listnode.html')
        .then(response => response.text())
        .then((html) => {
            let firstelement = true;
            ListBuffer.find((el) => {return el.name === shoppinglist}).items.forEach(element => {
                let node = (new DOMParser).parseFromString(html, 'text/html').body.firstChild;
                node.querySelector('.summary_div_left').innerHTML = capitalizeFirstLetter(element.item);
                if ( firstelement ) {
                    node.querySelector('.summary_div_left').innerHTML = node.querySelector('.summary_div_left').innerHTML + ' <em>Click Me!</em>';
                    firstelement = false;
                }
                node.querySelector('.summary_div_right').addEventListener('click', (event) => {removeFromList(element); node.remove();});
                node.querySelector('.summary_div_right').addEventListener('mousedown', (event) => {removeFromList(element); node.remove();});
                node.querySelector('p').innerHTML = 
                    `<ul><li>quantity: ${element.quantity} </li><li>preferences: ${element.preferences} </li><li>alternatives: ${element.alternatives} </li></ul>`;
                htmlList.appendChild(node);
            });
            let node = document.createElement("LI");
            node.setAttribute('id', 'add_item');
            node.setAttribute('data-expanded', 'false');
            node.appendChild(document.createElement("DIV"));
            node.childNodes.item(0).innerHTML = '<img id="plus" src="resources/plus.png"> Add Item';
            node.childNodes.item(0).addEventListener('click', () => showAddToListForm(shoppinglist));
            htmlList.appendChild(node);
        });
}

function removeFromList(element) {

}

function showAddToListForm(list) {
    let node = document.getElementById('add_item');
    if ( node.getAttribute('data-expanded') === 'false' ) {
        // TODO expand form
        let form = document.createElement("FORM");
        form.setAttribute('id', 'add_item_form');
        fetch(window.location.href + 'pages/addform.html')
            .then(response => response.text())
            .then(data => {
                form.innerHTML = data;
                item = document.getElementById('form_item');
                item.addEventListener('blur', () => {
                    ListBuffer.forEach( (lst) => {
                       if ( lst.name = list ) {
                           lst.items.forEach( (itm) => {
                                if ( itm.item.toLowerCase() === item.value.toLowerCase() || itm.item.toLowerCase() + 's' === item.value.toLowerCase() || itm.item.toLowerCase() === item.value.toLowerCase() + 's' ) {
                                    document.getElementById("form_preferences").value = itm.preferences;
                                    document.getElementById("form_quantity").value = itm.quantity;
                                    document.getElementById("form_alternatives").value = itm.alternatives;
                                }
                           });
                       }

                    });
                });
                ['click', 'mousedown'].forEach((event) => {
                    form.querySelector('#form_submit').addEventListener(event, () => {
                        let addedObject = {
                            item: document.getElementById("form_item").value,
                            preferences: document.getElementById("form_preferences").value,
                            quantity: document.getElementById("form_quantity").value,
                            alternatives: document.getElementById("form_alternatives").value
                        }
                        let bufferedlistindex = ListBuffer.findIndex((bufferlist)=>{return bufferlist.name === list})
                        let bufferedlist = ListBuffer[bufferedlistindex].items;
                        let bufferedObject = bufferedlist.find((el)=>{return el.item.toLowerCase() === addedObject.item.toLowerCase()});
                        if ( bufferedObject !== null && bufferedObject !== undefined ) {
                            let bufferedObjectIndex = bufferedlist.findIndex((el)=>{return el.item.toLowerCase() === addedObject.item.toLowerCase()});
                            ListBuffer[bufferedlistindex].items[bufferedObjectIndex] = addedObject;
                            writeListHTML(document.getElementById('main_body'),list);
                        }
                        else {
                            bufferedlist.push(addedObject);
                            writeListHTML(document.getElementById('main_body'),list);
                        }
                        // TODO make this inform the server
                    });
                }); 
            });
        node.appendChild(form);
        node.setAttribute('data-expanded', 'true');
    }
    else {
        document.getElementById('add_item_form').remove();
        node.setAttribute('data-expanded', 'false');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
}

async function updateListBuffer(callback) {
    ListNames.forEach((list) => {
        fetch(window.location.href + 'lists?list=' + list)
            .then(response => response.json())
            .then(data => {
                let alreadyContained = false;
                ListBuffer.forEach((list) => {
                    if ( list.name === list ) { 
                        list = data;
                        alreadyContained = true;
                    }                   
                });
                if ( !alreadyContained ) 
                    ListBuffer.push(data);
                callback();
            });
    });
}