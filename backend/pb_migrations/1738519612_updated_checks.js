/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2829024567")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "file2261913710",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "baseImgDiff",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "file635451634",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "lastShotDiff",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text44820260",
    "max": 1048576,
    "min": 0,
    "name": "baseTextDiff",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1344365064",
    "max": 1048576,
    "min": 0,
    "name": "lastTextDiff",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2829024567")

  // remove field
  collection.fields.removeById("file2261913710")

  // remove field
  collection.fields.removeById("file635451634")

  // remove field
  collection.fields.removeById("text44820260")

  // remove field
  collection.fields.removeById("text1344365064")

  return app.save(collection)
})
