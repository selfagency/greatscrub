/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // remove field
  collection.fields.removeById("editor670251241")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // add field
  collection.fields.addAt(8, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor670251241",
    "maxSize": 0,
    "name": "originalSnapshot",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
})
