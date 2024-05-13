var QuestionListView = Backbone.View.extend({
    initialize: function() {
        this.collection = new QuestionsCollection();
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch({reset: true});
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('templates/questionTemplate.html', function(data) {
            self.template = _.template($('<div>').html(data).find('#question-template').html());
            self.render(); 
        }).fail(function() {
            console.error('Failed to load question list template.');
        });
    },

    events: {
        'click .question-title a': 'navigateToDetail'
    },

    navigateToDetail: function(event) {
        event.preventDefault();  
        var questionId = $(event.currentTarget).data('id');
        Backbone.history.navigate('questions/' + questionId, { trigger: true });
    },

    render: function() {
        if (!this.template) {
            console.log('Template not yet loaded.');
            return this;
        }
        
        var questionData = this.collection.map(function(model) {
            var data = model.toJSON();
            data.formattedDate = new Date(data.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString();
            return data;
        });

        this.$el.html(this.template({ questions: questionData }));
        console.log('Rendered Question List View');
        return this;
    }
});
