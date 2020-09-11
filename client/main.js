window.addEventListener('load', (event)=>setup(event) );

function setup(event) {
    document.getElementById('nav_grocery_logo').addEventListener('click', () => showList('grocery'));
    document.getElementById('nav_grocery_logo').addEventListener('keydown', () => showList('grocery')); 
    document.getElementById('nav_household_logo').addEventListener('click', () => showList('household'));
    document.getElementById('nav_household_logo').addEventListener('keydown', () => showList('household')); 
    document.getElementById('header_logo').addEventListener('click', () => location.reload());
    document.getElementById('header_logo').addEventListener('keydown', () => location.reload()); 
    fetch(window.location.href + 'lists?list=grocery').then(response => response.json()).then(data => {if (data.items.length > 0) document.getElementById('nav_grocery_amount').innerHTML = data.items.length;});
    fetch(window.location.href + 'lists?list=household').then(response => response.json()).then(data => {if (data.items.length > 0) document.getElementById('nav_household_amount').innerHTML = data.items.length;});
}



function showList(list) {
    let body = document.getElementById("main_body");
    body.style.transition = 'opacity '+0.4+'s ease';
    body.style.opacity = 0;
    window.setTimeout(function() {
        fetch(window.location.href + 'lists?list=' + list)
            .then(response => response.json())
            .then(data => writeListHTML(data, body));
        window.scrollTo(window.scrollX, 0);
        window.setTimeout( function() {body.style.opacity = 1;}, 100); // Timeout necessary here to prevent flicker
    }, 400);
}

function writeListHTML(data, body) {
    body.innerHTML = '';
    let list = document.createElement("UL"); 
    list.className = 'itemlist';
    body.appendChild(list);
    console.log(data);
    let firstelement = true;
    data.items.forEach(element => {
        let node = document.createElement("LI");
        let details = document.createElement("DETAILS");
        let summary = document.createElement("SUMMARY");
        let summary_left = document.createElement("DIV");
        let summary_right = document.createElement("DIV");
        summary_right.className = 'summary_div_right';
        let p = document.createElement("p");
        summary_left.innerHTML = element.item;
        if ( firstelement ) {
            summary_left.innerHTML = element.item + ' <em>Click Me!</em>';
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
}

function removeFromList(element) {

}
