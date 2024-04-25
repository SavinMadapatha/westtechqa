var AnswerModel = Backbone.Model.extend({
  urlRoot: '/api/answers',
  defaults: {
    answerID: null,
    questionID: null,
    userID: null,
    content: '',
    votes: 0,
    postedDate: null
  }
});
