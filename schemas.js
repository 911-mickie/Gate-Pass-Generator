const Joi = require('joi');
// const sanitizeHtml = require("sanitize-html");


const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

module.exports.VisitorSchema = Joi.object({
    gatepass: Joi.object({
        name: Joi.string().required(),
        phoneNumber: Joi.number().required().min(0),
        purpose: Joi.string().required(),
        visitorAddress: Joi.string().required(),
        visitorCity: Joi.string().required(),
        visitorState: Joi.string().required(),
        aadharNumber: Joi.number().required().min(0),
    }).required()
})

