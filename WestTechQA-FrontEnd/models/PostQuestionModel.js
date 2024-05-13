var PostQuestionModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/WestTechQA/api/questions/addQuestion',
    defaults: {
        title: '',
        content: '',
        tags: [],
        user_id: null 
    },
    validate: function(attrs) {
        var errors = {};
        if (!attrs.title.trim()) {
            errors.title = 'Title cannot be empty.';
        }
        if (!attrs.content.trim()) {
            errors.content = 'Content cannot be empty.';
        }
        if (!attrs.tags.length) {
            errors.tags = 'At least one tag is required.';
        }
        if (!attrs.user_id) {
            errors.user_id = 'User ID is required.';
        }
        if (!_.isEmpty(errors)) {
            return errors;
        }
    }
});
