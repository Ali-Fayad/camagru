/**
 * DOM Manipulation Helpers
 */
const DOM = {
    /**
     * Select a single element
     */
    find: (selector, context = document) => context.querySelector(selector),

    /**
     * Select multiple elements
     */
    findAll: (selector, context = document) => Array.from(context.querySelectorAll(selector)),

    /**
     * Create an element with attributes and children
     */
    create: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    },

    /**
     * Clear all children of an element
     */
    clear: (element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    /**
     * Add event listener with automatic cleanup tracking (optional implementation)
     */
    on: (element, event, handler) => {
        element.addEventListener(event, handler);
        return () => element.removeEventListener(event, handler);
    }
};
