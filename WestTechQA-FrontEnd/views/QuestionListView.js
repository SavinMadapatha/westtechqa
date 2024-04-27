var QuestionListView = Backbone.View.extend({
    initialize: function() {
        this.collection = new QuestionsCollection();
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch({reset: true});
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
        this.template = window.templates.questionTemplate; // Assign template during render
        if (!this.template) {
            console.error('Template not loaded.');
            return this;
        }

        var questionData = this.collection.map(function(model) {
            var data = model.toJSON();
            var isoDateStr = data.posted_date.replace(' ', 'T') + 'Z';
            var postedDate = new Date(isoDateStr);
            data.formattedDate = postedDate.toLocaleDateString();
            data.dataId = model.get('question_id');
            return data;
        });
        // var htmlOutput = this.template({ questions: questionData });
        // console.log('HTML Output:', htmlOutput);
        this.$el.html(this.template({ questions: questionData }));
        console.log('Rendered Question List View');
        return this;
    }
});
