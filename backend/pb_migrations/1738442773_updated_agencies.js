/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT d.id, d.agency, d.url, d.rss, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN (\n    SELECT * FROM statuses ORDER BY created\n) as s ON s.domain = d.id\nLEFT JOIN (\n    SELECT * FROM snapshots ORDER BY created\n) as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_AbKX")

  // remove field
  collection.fields.removeById("_clone_oBxV")

  // remove field
  collection.fields.removeById("_clone_fOoA")

  // remove field
  collection.fields.removeById("_clone_iZAy")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_GJea",
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
    "id": "_clone_SOAZ",
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
    "id": "_clone_0xhS",
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
    "id": "_clone_GR5O",
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
    "viewQuery": "SELECT d.id, d.agency, d.url, d.rss, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN statuses as s ON s.domain = d.id\nLEFT JOIN snapshots as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_AbKX",
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
    "id": "_clone_oBxV",
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
    "id": "_clone_fOoA",
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
    "id": "_clone_iZAy",
    "name": "x",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("_clone_GJea")

  // remove field
  collection.fields.removeById("_clone_SOAZ")

  // remove field
  collection.fields.removeById("_clone_0xhS")

  // remove field
  collection.fields.removeById("_clone_GR5O")

  return app.save(collection)
})
