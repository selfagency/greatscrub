/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874128707");

  return app.delete(collection);
}, (app) => {
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
      },
      {
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
      },
      {
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
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_c5LT",
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
        "id": "_clone_Uojx",
        "name": "rss",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
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
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "_clone_hKRv",
        "name": "x",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
        "hidden": false,
        "id": "json1274027537",
        "maxSize": 1,
        "name": "statuses",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json1301366333",
        "maxSize": 1,
        "name": "snapshots",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_2874128707",
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "name": "domainsMeta",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT d.id, d.agency, d.office, d.branch, d.url, d.rss, d.favicon, d.x, \n       json_group_array(json_object('status', s.status, 'datetime', s.created)) AS statuses, \n       json_group_array(json_object('snapshot', n.snapshot, 'datetime', n.created)) AS snapshots\nFROM domains as d\nLEFT JOIN (\n    SELECT * FROM statuses ORDER BY created\n) as s ON s.domain = d.id\nLEFT JOIN (\n    SELECT * FROM snapshots ORDER BY created\n) as n ON n.domain = d.id\nGROUP BY d.id, d.agency, d.url, d.rss, d.x;",
    "viewRule": "@request.auth.id != ''"
  });

  return app.save(collection);
})
