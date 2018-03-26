/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__ (2);

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/** 
 * Web Element cu-accordion
 * - Attributes:
 *   - cu-model: Object
 *   - cu-multiple: Boolean
 */

class CuAccordion extends HTMLElement {
    constructor() {
        super();
        this.nodeOpen = null;
    }

    connectedCallback() {
        this.innerHTML = template;
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "styles/app.css";

/***/ })
/******/ ]);