/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT d.id, d.agency, d.office, d.branch, d.url, d.rss, d.favicon, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN (\n    SELECT * FROM statuses ORDER BY created\n) as s ON s.domain = d.id\nLEFT JOIN (\n    SELECT * FROM snapshots ORDER BY created\n) as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_rRuu")

  // remove field
  collection.fields.removeById("_clone_UmO7")

  // remove field
  collection.fields.removeById("_clone_naEX")

  // remove field
  collection.fields.removeById("_clone_Q0Lu")

  // remove field
  collection.fields.removeById("_clone_XLs2")

  // remove field
  collection.fields.removeById("_clone_TpPq")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_BSwB",
    "max": 0,
    "min": 0,
    "name": "agency",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_eIga",
    "max": 0,
    "min": 0,
    "name": "office",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_IwN3",
    "maxSelect": 1,
    "name": "branch",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "executive",
      "legislative",
      "judicial"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_c5LT",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_Uojx",
    "name": "rss",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_9lMw",
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

  // add field
  collection.fields.addAt(7, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_hKRv",
    "name": "x",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT d.id, d.agency, d.office, d.branch, d.url, d.rss, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN (\n    SELECT * FROM statuses ORDER BY created\n) as s ON s.domain = d.id\nLEFT JOIN (\n    SELECT * FROM snapshots ORDER BY created\n) as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_rRuu",
    "max": 0,
    "min": 0,
    "name": "agency",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_UmO7",
    "max": 0,
    "min": 0,
    "name": "office",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_naEX",
    "maxSelect": 1,
    "name": "branch",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "executive",
      "legislative",
      "judicial"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_Q0Lu",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_XLs2",
    "name": "rss",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_TpPq",
    "name": "x",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("_clone_BSwB")

  // remove field
  collection.fields.removeById("_clone_eIga")

  // remove field
  collection.fields.removeById("_clone_IwN3")

  // remove field
  collection.fields.removeById("_clone_c5LT")

  // remove field
  collection.fields.removeById("_clone_Uojx")

  // remove field
  collection.fields.removeById("_clone_9lMw")

  // remove field
  collection.fields.removeById("_clone_hKRv")

  return app.save(collection)
})
