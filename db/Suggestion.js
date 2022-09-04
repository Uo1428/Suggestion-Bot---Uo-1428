const { model, Schema } = require("mongoose")

module.exports = model("suggestion", new Schema({
  Guild: String,
  Channel: String
}))