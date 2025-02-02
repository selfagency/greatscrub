/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
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
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_VPqJ",
        "name": "url",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_V9A2",
        "name": "rss",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_zuZT",
        "name": "x",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
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
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "_clone_JRTJ",
        "maxSize": 0,
        "name": "snapshot",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "editor"
      }
    ],
    "id": "pbc_2874128707",
    "indexes": [],
    "listRule": null,
    "name": "agencies",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT d.id, d.agency, d.url, d.rss, d.x, s.status, n.snapshot \nFROM domains as d\nLEFT JOIN statuses as s ON s.domain = d.id\nLEFT JOIN snapshots as n ON n.domain = d.id;",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707");

  return app.delete(collection);
})
