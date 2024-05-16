var QuestionListView = Backbone.View.extend({
    initialize: function(options) {
        this.collection = new QuestionsCollection();
        var fetchOptions = { reset: true };
        if (options.search) {
            fetchOptions.data = { search: options.search };
        } else if (options.tag) {
            fetchOptions.data = { tag: options.tag };
        }
        this.collection.fetch(fetchOptions);
        this.listenTo(this.collection, 'sync', this.render);
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('templates/questionTemplate.html', function(data) {
            self.template = _.template($('<div>').html(data).find('#question-template').html());
            if (self.collection.length) self.render();
        }).fail(function() {
            console.error('Failed to load question list template.');
        });
    },

    events: {
        'click #tech-ask-question-btn': 'navigateToPostQuestion',
        'click .question-title a': 'navigateToDetail',
        'click .question-tag': 'filterByTag'
    },

    navigateToPostQuestion: function() {
        Backbone.history.navigate('ask', {trigger: true});
    },

    navigateToDetail: function(event) {
        event.preventDefault();  
        var questionId = $(event.currentTarget).data('id');
        Backbone.history.navigate('questions/' + questionId, { trigger: true });
    },

    filterByTag: function(event) {
        event.preventDefault();
        var tag = $(event.currentTarget).data('tag');
        Backbone.history.navigate('questions/tag/' + encodeURIComponent(tag), { trigger: true });
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

        if (questionData.length === 0) {
            this.$el.html('<div class="no-results">No questions found matching your search query!<br><a href="#questions" class="go-back">Go back</a></div>');
        } else {
            this.$el.html(this.template({ questions: questionData }));
        }

        console.log('Rendered Question List View');
        return this;
    }
});
