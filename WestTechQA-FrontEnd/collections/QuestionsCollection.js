var QuestionsCollection = Backbone.Collection.extend({
  model: QuestionModel,
  url: 'http://localhost/WestTechQA/api/questions'
});
