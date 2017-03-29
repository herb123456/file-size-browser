class RenderTemplate {
    constructor () {
        this.Mustache = require('mustache');
        // this.fileListTemplate = document.getElementById('file-list-template').innerHTML;
        // this.Mustache.parse(this.fileListTemplate);   // optional, speeds up future uses
    }

    parse (templateTarget) {
        // if (typeof templateTarget === "string") {
        //     templateTarget = $(templateTarget);
        // } else if (typeof templateTarget === "object" && templateTarget.constructor.name !== "jQuery") {
        //     templateTarget = $(templateTarget);
        // }

        this[templateTarget] = $(templateTarget).html();
        this.Mustache.parse(this[templateTarget]);
    }

    render (target, template, data) {
        if (typeof target === "string") {
            target = $(target);
        } else if (typeof target === "object" && target.constructor.name !== "jQuery") {
            target = $(target);
        }

        if (this[template] === undefined) {
            this.parse(template)
        }

        target.html("");
        target.append(this.Mustache.render(this[template], data));

        $(this).trigger("rendered");
    }
}

module.exports = RenderTemplate;