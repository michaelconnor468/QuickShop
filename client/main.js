window.addEventListener('load', (event)=>setup(event) );
let ListBuffer = []
let ListNames = ['grocery', 'household']

function setup(event) {
    document.getElementById('nav_grocery_logo').addEventListener('click', () => showList('grocery'));
    document.getElementById('nav_grocery_logo').addEventListener('keydown', () => showList('grocery')); 
    document.getElementById('nav_household_logo').addEventListener('click', () => showList('household'));
    document.getElementById('nav_household_logo').addEventListener('keydown', () => showList('household')); 
    document.getElementById('header_logo').addEventListener('click', () => location.reload());
    document.getElementById('header_logo').addEventListener('keydown', () => location.reload()); 
    fetch(window.location.href + 'lists?list=grocery')
        .then(response => response.json())
        .then(data => {
            if (data.items.length > 0) 
                document.getElementById('nav_grocery_amount').innerHTML = data.items.length;
            ListBuffer.push(data.items);
        });
    fetch(window.location.href + 'lists?list=household')
        .then(response => response.json())
        .then(data => {
            if (data.items.length > 0) 
                document.getElementById('nav_household_amount').innerHTML = data.items.length;
            ListBuffer.push(data.items);
        });
}

function showList(list) {
    let body = document.getElementById("main_body");
    body.style.transition = 'opacity '+0.4+'s ease';
    body.style.opacity = 0;
    window.setTimeout(function() {
        fetch(window.location.href + 'lists?list=' + list)
            .then(response => response.json())
            .then(data => writeListHTML(data, body, list));
        window.scrollTo(window.scrollX, 0);
        window.setTimeout( function() {body.style.opacity = 1;}, 100); // Timeout necessary here to prevent flicker
    }, 400);
}

function writeListHTML(data, body, shoppinglist) {
    body.innerHTML = '';
    let list = document.createElement("UL"); 
    list.className = 'itemlist';
    body.appendChild(list);
    let firstelement = true;
    data.items.forEach(element => {
        let node = document.createElement("LI");
        let details = document.createElement("DETAILS");
        let summary = document.createElement("SUMMARY");
        let summary_left = document.createElement("DIV");
        let summary_right = document.createElement("DIV");
        summary_right.className = 'summary_div_right';
        let p = document.createElement("p");
        summary_left.innerHTML = capitalizeFirstLetter(element.item);
        if ( firstelement ) {
            summary_left.innerHTML = summary_left.innerHTML + ' <em>Click Me!</em>';
            firstelement = false;
        }
        summary_right.innerHTML = "<img id=\"checkmark\" src=\"resources/checkmark.png\">";
        summary_right.addEventListener('click', (event) => {removeFromList(element); node.remove();});
        summary_right.addEventListener('mousedown', (event) => {removeFromList(element); node.remove();});
        p.innerHTML = "<ul><li>quantity: " + element.quantity + "</li><li>preferences: " + element.preferences + "</li><li>alternatives: " + element.alternatives + "</li></ul>";
        summary.appendChild(summary_left);
        summary.appendChild(summary_right);
        details.appendChild(summary);
        details.appendChild(p);
        node.appendChild(details);
        list.appendChild(node); 
    });
    let node = document.createElement("LI");
    node.setAttribute('id', 'add_item');
    node.setAttribute('data-expanded', 'false');
    node.appendChild(document.createElement("DIV"));
    node.childNodes.item(0).innerHTML = '<img id="plus" src="resources/plus.png"> Add Item';
    node.childNodes.item(0).addEventListener('click', () => showAddToListForm(shoppinglist));
    //node.addEventListener('mousedown', () => showAddToListForm(shoppinglist));
    list.appendChild(node);
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
                           lst.forEach( (itm) => {
                                if ( itm.item.toLowerCase() === item.value.toLowerCase() || itm.item.toLowerCase() + 's' === item.value.toLowerCase() || itm.item.toLowerCase() === item.value.toLowerCase() + 's' )
                                    document.getElementById("form_preferences").value = itm.preferences;
                                    document.getElementById("form_quantity").value = itm.quantity;
                                    document.getElementById("form_alternatives").value = itm.alternatives;
                           });
                       }

                    });
                });
            });
        // document.getElementById("form_submit").addEventListener('click', () => {
        //     // TODO write to server and add to list
        // });
        // document.getElementById("form_submit").addEventListener('mousedown', () => {
        //     // TODO write to server and add to list
        // });
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

async function updateListBuffer() {
    ListNames.forEach( (list) => {
        fetch(window.location.href + 'lists?list=' + list)
            .then(response => response.json())
            .then(data => {
                ListBuffer.forEach((list) => {
                    if ( list.name === list ) {
                        list = data.items;
                    }
                    else {
                        ListBuffer.push(data.items);
                    }
                });
            });
    });
}