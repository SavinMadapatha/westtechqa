var PostAnswerModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/WestTechQA/api/answers/addAnswer',  

    defaults: {
        question_id: '',
        user_id: null,
        content: ''
    },

    validate: function(attrs) {
        var errors = [];
        if (!attrs.content.trim()) {
            errors.push('The answer content cannot be empty.');
        }
        if (!attrs.question_id) {  
            errors.push('Question ID must be provided.');
        }
        if (errors.length > 0) {
            return errors;
        }
    }
});
