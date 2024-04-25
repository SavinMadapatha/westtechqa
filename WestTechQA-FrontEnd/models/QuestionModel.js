var QuestionModel = Backbone.Model.extend({
  urlRoot: 'http://localhost/WestTechQA/api/questions',
  idAttribute: 'question_id',  // Ensure this matches the identifier attribute your API expects.
  defaults: {
    questionID: null,
    userID: null,
    title: '',
    content: '',
    postedDate: null,
    tags: [] 
  }
});
