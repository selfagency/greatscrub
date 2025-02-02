/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file2229311990",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "favicon",
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
  collection.fields.removeById("file2229311990")

  return app.save(collection)
})
