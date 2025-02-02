/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT d.id, d.agency, d.url, d.rss, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN statuses as s ON s.domain = d.id\nLEFT JOIN snapshots as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_qRxM")

  // remove field
  collection.fields.removeById("_clone_VPqJ")

  // remove field
  collection.fields.removeById("_clone_V9A2")

  // remove field
  collection.fields.removeById("_clone_zuZT")

  // remove field
  collection.fields.removeById("_clone_4NWx")

  // remove field
  collection.fields.removeById("_clone_JRTJ")

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

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json1274027537",
    "maxSize": 1,
    "name": "statuses",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "json1301366333",
    "maxSize": 1,
    "name": "snapshots",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT d.id, d.agency, d.url, d.rss, d.x, s.status, n.snapshot \nFROM domains as d\nLEFT JOIN statuses as s ON s.domain = d.id\nLEFT JOIN snapshots as n ON n.domain = d.id;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_qRxM",
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
    "id": "_clone_VPqJ",
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
    "id": "_clone_V9A2",
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
    "id": "_clone_zuZT",
    "name": "x",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_4NWx",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "up",
      "down"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "_clone_JRTJ",
    "maxSize": 0,
    "name": "snapshot",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  // remove field
  collection.fields.removeById("_clone_AbKX")

  // remove field
  collection.fields.removeById("_clone_oBxV")

  // remove field
  collection.fields.removeById("_clone_fOoA")

  // remove field
  collection.fields.removeById("_clone_iZAy")

  // remove field
  collection.fields.removeById("json1274027537")

  // remove field
  collection.fields.removeById("json1301366333")

  return app.save(collection)
})
