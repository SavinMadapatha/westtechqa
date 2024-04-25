var QuestionListView = Backbone.View.extend({

    initialize: function() {
        this.collection = new QuestionsCollection();
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        // Fetch the template HTML from an external file
        $.get('templates/questionTemplate.html')
            .done(function(data) {
                // Ensure the template element is correctly found within the fetched data
                var templateHtml = $("<div>").html(data).find('#question-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.listenTo(self.collection, 'sync', self.render);  // Listen for the sync event
                    self.collection.fetch({reset: true});  // Fetch the collection data
                } else {
                    console.error('Template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the questions template.');
            });
    },

    render: function() {
        var self = this;
        this.$el.empty(); // Clears the existing list

        if (!this.template) {
            return this; // Exit if the template isn't loaded
        }

        var questionData = this.collection.map(function(model) {
            var data = model.toJSON();

            // Perform the date conversion here
            var isoDateStr = data.posted_date.replace(' ', 'T') + 'Z';
            var postedDate = new Date(isoDateStr);

            // Replace data.posted_date with formatted date
            data.formattedDate = postedDate.toLocaleDateString();

            return data;
        });

        // Render the collection using the template
        this.$el.html(this.template({ questions: questionData }));

        return this;
    },

    // addQuestion: function(question) {
    //     var view = new QuestionView({model: question});
    //     this.$el.append(view.render().el);
    // }
});

