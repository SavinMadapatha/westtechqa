var QuestionDetailModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/WestTechQA/api/questions',

    url: function() {
        return this.urlRoot + '/' + encodeURIComponent(this.get('id'));
    }
});