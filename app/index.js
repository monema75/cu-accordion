require ('./components/cuAccordion/cuAccordion.js');

// Init ---------------------------------------------------------

let accordion = document.getElementById('accordion-001');
let accordionMultiple = document.getElementById('accordion-002');

let addChildBtn = document.getElementById('addChild');
let toggleChildBtn = document.getElementById('toggleChild');    
let closeAllBtn = document.getElementById('closeAll');

addChildBtn.addEventListener('click', function(){
    let titleNode = document.getElementById('addChild-title');
    let contentNode = document.getElementById('addChild-content');
    
    accordion.addChild({
        "title": titleNode.value,
        "content": contentNode.value
    });

    titleNode.value = contentNode.value = "";
});

toggleChildBtn.addEventListener('click', function(){
    let position = document.getElementById('toggleChild-position').value;
    
    accordion.toggleChildAt(position);
});

closeAllBtn.addEventListener('click', function(){
    accordionMultiple.closeAll();
});

// Fetch Data from Service ----------------------------------------

fetch('./data/accordion.json')
    .then((response) => response.text())
    .then((responseText) => {
        let data = JSON.parse(responseText);

        accordion.dataModel = data['0001'];
        accordionMultiple.dataModel = data['0002'];
    })
    .catch((error) => {
        console.error(error);
    });