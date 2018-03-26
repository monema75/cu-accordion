/** 
 * Web Element cu-accordion
 * - Attributes:
 *   - cu-model: Object
 *   - cu-multiple: Boolean
 */

class CuAccordion extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = template;
        this.nodeOpen = null;
    }

    render(dataModel) {
        let content = "";
        let container = this.querySelector('dl');
        let event = new CustomEvent("cu-accordion:ready");

        dataModel.forEach((childModel) => {
            content += getChildren(childModel);
        });

        container.innerHTML = content;
        
        this.dispatchEvent(event);

        registerEvents(this);
    }

    addChild(dataModel) {
        let container = this.querySelector('dl');
        let newChildTemplate = getChildren(dataModel);

        container.insertAdjacentHTML('beforeend', newChildTemplate);
    }

    toggleChildAt(position) {
        let dtElements = this.querySelectorAll('dt');

        if(position < dtElements.length) {
            let element = dtElements[position];
            
            if(!this.multiple) {
                toggleUnique(element);
            } else {
                toggle(element);
            }
        }
    }

    closeAll() {
        let dtOpen = this.querySelectorAll('dt.' + state.open);

        dtOpen.forEach(toggle);
        this.nodeOpen = null;
    }

    get multiple() {
        return !!this.getAttribute('cu-multiple');
    }

    set multiple(value) {
        if(!!value) {
            this.setAttribute('cu-multiple', value);
        } else {
            this.removeAttribute('cu-multiple');
        }
    }

    set dataModel(data) {
        this.render(data);
    }
}

// -----------------------------------------------------------------------------

const template = `
    <div class="cuAccordion">
        <dl class="cuAccordion-container"></dl>
    </div> `;

const state = {
    open: "is-open"
};

const getChildren = function(dataModel) {
    return `
        <dt class="cuAccordion-childTitle">${dataModel.title}</dt>
        <dd class="cuAccordion-childContent">${dataModel.content}</dd>
    `;
};

const toggleUnique = function(nodeDT){
    let isOpen = toggle(nodeDT);
    
    if(this.nodeOpen && this.nodeOpen !== nodeDT) {
        toggle(this.nodeOpen);    
    }

    this.nodeOpen = isOpen
        ? nodeDT
        : null
};

const toggle = function(node) {
    let ddNode = node.nextElementSibling;
    
    if(ddNode.tagName === 'DD') {
        let isOpen = node.classList.toggle(state.open);

        if(isOpen) {
            ddNode.classList.add(state.open);
            ddNode.style.maxHeight = ddNode.scrollHeight + "px";
        } else {
            ddNode.classList.remove(state.open);
            ddNode.style.maxHeight = ""; 
        }   

        return isOpen;
    }

    return false;
};

const registerEvents = function(node) {
    node.addEventListener("click", function(event) {
        let target = event.target;
        
        if(target.tagName === 'DT') {
            if(!this.multiple) {
                toggleUnique(target);
            } else {
                toggle(target);
            }
        }
    });
};

// -----------------------------------------------------------------------------

customElements.define('cu-accordion', CuAccordion);