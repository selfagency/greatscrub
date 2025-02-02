/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "file818660249",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "originalScreenshot",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // remove field
  collection.fields.removeById("file818660249")

  return app.save(collection)
})
