/**
 * @module Item
 */
define(['backbone'], function (Backbone) {
    var Item;

    /**
     * @alias module:Item
     * @exports Item
     */
    Item = Backbone.View.extend(
        /** @lends module:Item.prototype */
        {
            /**
             * @constructs
             * @param {Object} options
             * @param {Backbone.View}  options.list
             * @param {Backbone.Model} options.model
             */
            constructor: function(options) {
                this.list = options.list;

                Backbone.View.apply(this, arguments);
            },

            initialize: function() {
                this.listenTo(this.list, 'focus', this.focus);
                this.listenTo(this.model, 'change:selected', this.toggleSelected);
            },

            tagName: 'li',

            /**
             * @returns {string}
             */
            className: function () {
                var className;

                className = [];

                className.push('selectius-item');

                if (this.isSelected()) {
                    className.push('selected');
                }

                return className.join(' ');
            },

            /**
             * @returns {Object}
             */
            attributes: function () {
                var attributes;

                attributes = {
                    role    : 'option',
                    tabindex: 0
                };

                if (this.isSelected()) {
                    attributes['aria-selected'] = 'true';
                }

                return attributes;
            },

            /**
             * DOM events
             * @see {@link module:Item#select}
             * @see {@link module:Item#handleKeydown}
             */
            events: {
                click: 'select',
                keydown: 'handleKeydown'
            },

            /**
             * @returns {Boolean}
             */
            isSelected: function() {
                return this.model.get('selected');
            },

            /**
             * @param {Event|jQuery.Event} event
             */
            handleKeydown: function (event) {
                var key, KEY_ENTER, KEY_SPACE;

                KEY_ENTER = 13;
                KEY_SPACE = 32;
                key = event.keyCode;

                switch (key) {
                    case KEY_ENTER:
                    case KEY_SPACE:
                        this.select();
                        break;
                }
            },

            /**
             * Trigger model event
             */
            select: function() {
                this.model.trigger('selected#change', this.model);
            },

            /**
             * @param {Backbone.Model} item
             * @param {Boolean}        selected
             */
            toggleSelected: function(item, selected) {
                if (!selected) {
                    this.clearSelection();
                } else {
                    this.setSelection();
                }
            },

            clearSelection: function() {
                var element;

                element = this.el;

                element.classList.remove('selected');
                element.setAttribute('aria-selected', 'false');
            },

            setSelection: function() {
                var element;

                element = this.el;

                element.classList.add('selected');
                element.setAttribute('aria-selected', 'true');
            },

            /**
             * Focus item on list focus, if item active
             */
            focus: function() {
                if (this.model.get('selected')) {
                    this.el.focus();
                }
            },

            /**
             * @returns {Item}
             */
            render: function() {
                this.el.textContent = this.model.get('label');

                return this;
            }
        }
    );

    return Item;
});