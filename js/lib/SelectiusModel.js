define(['backbone'], function (Backbone) {
    var SelectiusModel;

    SelectiusModel = Backbone.Model.extend({
        initialize: function() {
            this.listenTo(this.collection, 'selected#change', this.checkSelected);
            this.on('selected#change', this.toggleSelected, this);
        },

        toggleSelected: function() {
            this.set('selected', true);
        },

        checkSelected: function(model) {
            if (model !== this) {
                this.set('selected', false);
            }
        }
    });

    return SelectiusModel;
});