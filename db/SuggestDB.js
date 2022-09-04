const { model, Schema } = require("mongoose")

module.exports = model("suggestDB", new Schema({
    Guild: String,
    MessageID: String,
    Details: Array
}))