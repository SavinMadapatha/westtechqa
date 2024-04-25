var CommentModel = Backbone.Model.extend({
  urlRoot: '/api/comments',
  defaults: {
    commentID: null,
    answerID: null,
    userID: null,
    content: '',
    postedDate: null
  }
});
