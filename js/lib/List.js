/**
 * @module List
 */
define(['backbone', 'Item'], function (Backbone, Item) {
    var List;

    /**
     * @alias module:List
     * @extends Backbone.View
     */
    List = Backbone.View.extend(
        /** @lends module:List.prototype */
        {
            /**
             * @constructs
             * @param {Object}            options
             * @param {HTMLSelectElement} options.select
             * @param {String}            options.label
             * @param {String}            options.value
             * @param {Boolean}           options.isOpen
             */
            constructor: function (options) {
                /** @type {HTMLSelectElement} */
                this.select = options.select;
                /** @type {String} */
                this.selectId = this.select.getId();

                Backbone.View.apply(this, arguments);
            },

            initialize: function (options) {
                /** @type {String} */
                this.label    = options.label || 'label';
                /** @type {String} */
                this.value    = options.value || 'value';
                /** @type {Boolean} */
                this.isOpen   = options.isOpen;
            },

            /** @default */
            tagName: 'ul',

            /**
             * Attributes hash
             * @returns {Object}
             */
            attributes: function() {
                var attributes;

                attributes = {
                    role    : 'listbox',
                    tabindex: -1,
                    'aria-labelledby': 'selectius-label-' + this.selectId
                };

                if (!this.isOpen) {
                    attributes['aria-hidden'] = 'true'
                }

                return attributes;
            },

            /**
             * @returns {string}
             */
            className: function() {
                var className;

                className = [];

                className.push('selectius-list');

                if (!this.isOpen) {
                    className.push('hidden');
                }

                return className.join(' ');
            },

            /**
             * DOM events
             * @see {@link List#close}
             * @see {@link List#handleKeydown}
             */
            events: {
                click: 'close',
                keydown: 'handleKeydown'
            },

            /**
             * @param {Event|jQuery.Event} event
             */
            handleKeydown: function (event) {
                var key, KEY_ENTER, KEY_SPACE, KEY_UP, KEY_DOWN;

                KEY_ENTER = 13;
                KEY_SPACE = 32;
                KEY_UP    = 38;
                KEY_DOWN  = 40;
                key = event.keyCode;

                switch (key) {
                    case KEY_ENTER:
                    case KEY_SPACE:
                        this.close();
                        break;

                    case KEY_UP:
                        this.previousItemSelect(event.target);
                        break;

                    case KEY_DOWN:
                        this.nextItemSelect(event.target);
                        break;
                }
            },

            /**
             * Trigger focus on previous HTML `option`
             * @param {HTMLSelectElement} element
             */
            previousItemSelect: function(element) {
                var previous;

                previous = element.previousElementSibling;

                if (!previous) {
                    return;
                }

                previous.focus();
            },

            /**
             * Trigger focus on next HTML `option`
             * @param {HTMLSelectElement} element
             */
            nextItemSelect: function(element) {
                var next;

                next = element.nextElementSibling;

                if (!next) {
                    return;
                }

                next.focus();
            },

            /**
             * Looks on the current state ({@link List#isOpen isOpen}) and
             * trigger appropriate method
             * @see {@link List#close}
             * @see {@link List#open}
             */
            toggle: function() {
                if (this.isOpen) {
                    this.close();
                } else {
                    this.open();
                }
            },

            /**
             * Perform list closing
             */
            close: function() {
                this.isOpen = false;
                this.el.classList.add('hidden');
                this.el.setAttribute('aria-hidden', 'true');
            },

            /**
             * Make sure that select options are fully visible
             *
             * @returns {boolean}
             */
            isEnoughSpace: function() {
                return this.el.getBoundingClientRect().bottom
                    < window.innerHeight;
            },

            setFlippedCoordinates: function() {
                var element;

                element = this.el;

                element.style.top = '-' + (element.offsetHeight) + 'px';
            },

            clearFlippedCoordinates: function() {
                this.el.style.top = '';
            },

            /**
             * Perform list opening
             */
            open: function() {
                this.isOpen = true;
                this.el.classList.remove('hidden');
                this.el.setAttribute('aria-hidden', 'false');

                this.clearFlippedCoordinates();

                if (!this.isEnoughSpace()) {
                    this.setFlippedCoordinates();
                }

                this.focus();
            },

            /**
             * Trigger focus for other listeners
             * @fires module:List#focus
             */
            focus: function() {
                /** @event module:List#focus */
                this.trigger('focus');
            },

            /**
             * @param {Backbone.Model} model
             */
            addItem: function(model) {
                var item;

                item = new Item({
                    model: model,
                    list: this
                });

                this.el.appendChild(item.render().el);
            },

            /**
             * @returns {List}
             */
            render: function() {
                this.collection.models.forEach(this.addItem, this);

                return this;
            }
        }
    );

    return List;
});