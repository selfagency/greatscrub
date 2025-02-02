/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2829024567")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_489209975",
    "hidden": false,
    "id": "relation2812878347",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "domain",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file1486429761",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "screenshot",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor2245179681",
    "maxSize": 0,
    "name": "textSnapshot",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool486510651",
    "name": "down",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2829024567")

  // remove field
  collection.fields.removeById("relation2812878347")

  // remove field
  collection.fields.removeById("file1486429761")

  // remove field
  collection.fields.removeById("editor2245179681")

  // remove field
  collection.fields.removeById("bool486510651")

  return app.save(collection)
})
