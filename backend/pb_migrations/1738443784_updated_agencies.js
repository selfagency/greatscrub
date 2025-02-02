/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "name": "domainsMeta",
    "viewQuery": "SELECT d.id, d.agency, d.office, d.branch, d.url, d.rss, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN (\n    SELECT * FROM statuses ORDER BY created\n) as s ON s.domain = d.id\nLEFT JOIN (\n    SELECT * FROM snapshots ORDER BY created\n) as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_uj8V")

  // remove field
  collection.fields.removeById("_clone_25cK")

  // remove field
  collection.fields.removeById("_clone_ErxK")

  // remove field
  collection.fields.removeById("_clone_ptwv")

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "name": "agencies",
    "viewQuery": "SELECT d.id, d.agency, d.url, d.rss, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN (\n    SELECT * FROM statuses ORDER BY created\n) as s ON s.domain = d.id\nLEFT JOIN (\n    SELECT * FROM snapshots ORDER BY created\n) as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_uj8V",
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
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_25cK",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_ErxK",
    "name": "rss",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_ptwv",
    "name": "x",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

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

  return app.save(collection)
})
