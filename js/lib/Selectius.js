/**
 * @module Selectius
 */
define(['underscore', 'backbone', 'List', 'SelectiusModel'],
function (_, Backbone, List, Model) {
    var Selectius;

    /**
     * Serialize select element
     * @private
     * @param {HTMLSelectElement} select
     * @returns {Array}
     */
    function getCollection(select) {
        var collection, index, length, firstChild,
            model, value, label, isSelected;

        select = select.cloneNode(true);
        collection = [];
        index = 0;
        length = select.children.length;
        firstChild = select.firstElementChild;

        while (firstChild && index < length) {
            value = firstChild.value;
            label = firstChild.textContent;
            isSelected = firstChild.selected;
            model = {
                value: value,
                label: label,
                selected: isSelected
            };

            collection.push(model);

            firstChild = firstChild.nextElementSibling;

            ++index;
        }

        index = null;
        length = null;
        firstChild = null;
        model = null;
        value = null;
        label = null;
        isSelected = null;

        return collection;
    }

    /**
     * @alias Selectius
     * @exports Selectius
     * @extends {Backbone.View}
     */
    Selectius = Backbone.View.extend(
        /** @lends module:Selectius.prototype */
        {
            /**
             * @constructs
             * @throws Error when reference undefined
             * @param {Object} options
             * @param {Backbone.Collection=} options.collection
             * @param {HTMLSelectElement}    options.reference
             */
            constructor: function(options) {
                if (!options.collection && options.reference) {
                    options.collection = new Backbone.Collection(
                        getCollection(options.reference),
                        {
                            model: Model
                        }
                    );
                }

                if (!options.collection && !options.reference) {
                    throw new Error('No data provided. You should provide ' +
                        'reference element and collection with data.');
                }

                Backbone.View.apply(this, arguments);
            },

            /**
             * Initialize
             * @param {Object} options
             * @param {Backbone.Collection} options.collection
             * @param {Boolean}             options.isOpen
             * @param {HTMLSelectElement}   options.reference
             */
            initialize: function(options) {
                /** Instance of {@link module:List} */
                this.list = new List({
                    collection: options.collection,
                    isOpen    : options.isOpen || false,
                    select    : this
                });

                /** @type {HTMLSelectElement} */
                this.reference = options.reference;

                this.hideReference();

                this.on('render', this.registerShortcuts);
                this.listenTo(this.collection, 'change:selected',
                    this.updateSelected);
                this.listenTo(this.collection, 'change:selected',
                    this.updateReferenceValue);
            },

            /** @default */
            className: 'selectius',

            attributes: {
                tabindex: 0
            },

            template: _.template(
                '<div class="selectius-selected"' +
                    ' id="selectius-label-{{ id }}">{{ selected }}</div>' +
                    '<span class="caret"></span>'),

            events: {
                'click .selectius-selected': 'toggleList',
                keydown: 'handleKeydown'
            },

            /**
             * @param {Event|jQuery.Event} event
             */
            handleKeydown: function(event) {
                var key, isThatElement,
                    KEY_ENTER, KEY_ESC, KEY_SPACE, KEY_UP, KEY_DOWN;

                KEY_ENTER = 13;
                KEY_ESC = 27;
                KEY_SPACE = 32;
                KEY_UP    = 38;
                KEY_DOWN  = 40;
                key = event.keyCode;
                isThatElement = event.target === this.el;

                switch (key) {
                    case KEY_ESC  : this.close(); break;
                    case KEY_ENTER:
                    case KEY_SPACE:
                        if (isThatElement && key !== KEY_ENTER) {
                            this.open();
                        } else {
                            this.close();
                        }
                        break;

                    case KEY_UP:
                    case KEY_DOWN:
                        if (isThatElement) {
                            this.toggleList();
                        }
                        break;
                }
            },

            /**
             * Open select list
             * @see {@link module:List#open}
             */
            open: function() {
                this.list.open();
            },

            /**
             * Close select list
             * @see {@link module:List#close}
             */
            close: function () {
                this.list.close();
                this.el.focus();
            },

            /**
             * Let select list decide itself what action perform (open or close)
             * @see {@link module:List#toggle}
             */
            toggleList: function() {
                this.list.toggle();
            },

            /**
             * Register elements shortcuts after render
             */
            registerShortcuts: function() {
                /** @type {HTMLElement} */
                this.selected = this.el.querySelector('.selectius-selected');
            },

            /**
             * Hide original select
             */
            hideReference: function() {
                if (!this.reference) {
                    return;
                }

                this.reference.classList.add('hidden');
            },

            /**
             * Show currently selected item
             * @param {Backbone.Model} item
             * @param {Boolean}        selected
             */
            updateSelected: function(item, selected) {
                if (selected) {
                    this.selected.textContent = item.get('label');
                }
            },

            /**
             * Update reference value
             * @param {Backbone.Model} item
             * @param {Boolean}        selected
             */
            updateReferenceValue: function(item, selected) {
                if (selected && this.reference) {
                    this.reference.value = item.get('value');
                }
            },

            /**
             * Get selected model
             * @returns {Backbone.Model}
             */
            getSelected: function() {
                return this.collection.findWhere({selected: true});
            },

            /**
             * Get current select value
             * @returns {String}
             */
            getValue: function() {
                return this.getSelected().get('value');
            },

            /**
             * @returns {String}
             */
            getId: function() {
                return this.id || this.cid;
            },

            /**
             * Renders selected option (AKA closed state of select)
             */
            renderSelected: function() {
                var element;

                element = this.el;

                if (this.selected) {
                    return;
                }

                element.innerHTML = this.template({
                    selected: this.getSelected().get('label'),
                    id: this.getId()
                });
            },

            /**
             * Renders available options list
             */
            renderList: function() {
                var element;

                element = this.el;

                if (element.querySelector('.selectius-list')) {
                    return;
                }

                element.appendChild(this.list.render().el);
            },

            /**
             * @fires module:Selectius#render
             * @returns {Selectius}
             *
             * @see {@link module:Selectius#renderSelected}
             * @see {@link module:Selectius#renderList}
             */
            render: function() {
                this.renderSelected();
                this.renderList();

                /** @event module:Selectius#render */
                return this.trigger('render');
            }
        }
    );

    return Selectius;
});