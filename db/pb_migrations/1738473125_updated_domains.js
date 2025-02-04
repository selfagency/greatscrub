/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_489209975",
    "hidden": false,
    "id": "relation574902519",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "redirection",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // remove field
  collection.fields.removeById("relation574902519")

  return app.save(collection)
})
