var QuestionDetailView = Backbone.View.extend({
    initialize: function(options) {
        this.questionId = options.questionId;
        this.model = new QuestionDetailModel({ id: this.questionId });
        this.template = null;
        
        var self = this;
        $.get('templates/questionDetailTemplate.html').done(function(data) {
            self.template = _.template($('<div>').html(data).find('#question-detail-template').html());
            self.listenTo(self.model, 'sync', self.render);
            self.model.fetch(); 
        }).fail(function() {
            console.error('Failed to load question detail template.');
        });
    },

    events: {
        'click #ask-question-btn': 'askQuestion'
    },

    askQuestion: function() {
        Backbone.history.navigate('ask', { trigger: true });
    },

    render: function() {
        if (!this.template) {
            console.log('Template not yet loaded.');
            return this;
        }
    
        var data = this.model.toJSON();
    
        data.formattedDate = new Date(data.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString();
    
        if (data.answers && Array.isArray(data.answers)) {
            data.answersCount = data.answers.length;
            data.answers = data.answers.map((answer) => ({
                ...answer,
                formattedDate: new Date(answer.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString()
            }));
        }
    
        this.$el.html(this.template(data));
        console.log('Rendered Question Detail View');
        return this;
    }
    
});
