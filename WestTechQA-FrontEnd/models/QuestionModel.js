var QuestionModel = Backbone.Model.extend({
  urlRoot: 'http://localhost/WestTechQA/api/questions',
  idAttribute: 'question_id',  
  defaults: {
    questionID: null,
    userID: null,
    title: '',
    content: '',
    postedDate: null,
    tags: [] 
  }
});
