/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2507485050",
    "max": 1048576,
    "min": 0,
    "name": "baseSnapshot",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "file818660249",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "baseImage",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url1060589606",
    "name": "archiveUrl",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_489209975")

  // remove field
  collection.fields.removeById("text2507485050")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "file818660249",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "jan19Screenshot",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url1060589606",
    "name": "jan19Snapshot",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
})
