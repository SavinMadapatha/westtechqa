var AnswerDetailModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/WestTechQA/api/answers',

    defaults: {
        answerID: null,
        questionID: null,
        userID: null,
        content: '',
        votes: 0,
        postedDate: null,
        accepted: null,
        answer_username: '',
        comments: []
    }
});
