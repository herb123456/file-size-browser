// class RenderTemplate {
//     constructor () {
//         this.Mustache = require('mustache');
//         // this.fileListTemplate = document.getElementById('file-list-template').innerHTML;
//         // this.Mustache.parse(this.fileListTemplate);   // optional, speeds up future uses
//     }
//
//     parse (templateTarget) {
//         // if (typeof templateTarget === "string") {
//         //     templateTarget = $(templateTarget);
//         // } else if (typeof templateTarget === "object" && templateTarget.constructor.name !== "jQuery") {
//         //     templateTarget = $(templateTarget);
//         // }
//
//         this[templateTarget] = $(templateTarget).html();
//         this.Mustache.parse(this[templateTarget]);
//     }
//
//     render (target, template, data) {
//         if (typeof target === "string") {
//             target = $(target);
//         } else if (typeof target === "object" && target.constructor.name !== "jQuery") {
//             target = $(target);
//         }
//
//         if (this[template] === undefined) {
//             this.parse(template)
//         }
//
//         target.html("");
//         target.append(this.Mustache.render(this[template], data));
//
//         $(this).trigger("rendered");
//     }
// }

class RenderTemplate {
    constructor () {
        this.Handlebars = require('handlebars');
        // this.fileListTemplate = document.getElementById('file-list-template').innerHTML;
        // this.Mustache.parse(this.fileListTemplate);   // optional, speeds up future uses

        // {{#ifCond var1 '==' var2}}
        this.Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });
    }

    parse (templateTarget) {
        // if (typeof templateTarget === "string") {
        //     templateTarget = $(templateTarget);
        // } else if (typeof templateTarget === "object" && templateTarget.constructor.name !== "jQuery") {
        //     templateTarget = $(templateTarget);
        // }

        this[templateTarget] = this.Handlebars.compile($(templateTarget).html());
        // this[templateTarget]);
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
        // target.append(this.Handlebars.render(, data));
        target.html(this[template](data));

        $(this).trigger("rendered");
    }
}

module.exports = RenderTemplate;