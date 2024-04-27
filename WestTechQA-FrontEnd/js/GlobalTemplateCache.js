window.templates = {};  // Global template cache

function loadTemplate(name, url) {
    return $.get(url).then(function(data) {
        window.templates[name] = _.template(data);
    });
}

function preloadTemplates() {
    var templates = [
        { name: 'loginTemplate', url: 'templates/loginTemplate.html' },
        { name: 'registerTemplate', url: 'templates/registerTemplate.html' },
        { name: 'questionTemplate', url: 'templates/questionTemplate.html' },
        { name: 'questionDetailTemplate', url: 'templates/questionDetailTemplate.html' }
    ];

    var promises = templates.map(template => loadTemplate(template.name, template.url));
    return Promise.all(promises);
}