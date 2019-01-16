var exampleData = {
	pid: '001',
	name: 'Model Example',
	nodeList: [
		{
			id: '01',
			type: 'datasource', //datasource, algrorithm....
			comment: '',
			precursorIds: [],
			successorIds: ['02'],
			data: {
				filepath: './file/data.txt',
				alias: 'data.txt'
			},
			position: {
				top: 100,
				left: 50
			}
		},
		{
			id: '02',
			type: 'algrorithm', //datasource, algrorithm....
			comment: '',
			precursorIds: ['01'],
			successorIds: [],
			data: {
				algrorithm: 'A1',
				alias: 'A1'
			},
			position: {
				top: 200,
				left: 400
			}
		},
		{
			id: '03',
			type: 'algrorithm', //datasource, algrorithm....
			comment: '',
			precursorIds: [],
			successorIds: ['02'],
			data: {
				algrorithm: 'A1',
				alias: 'A1'
			},
			position: {
				top: 300,
				left: 50
			}
		}
	],
	connectionList: [
		{
			sourceId: '01',
			targetId: '02'
		},
		{
			sourceId: '03',
			targetId: '02'
		}
	]
}
var tipsData = {
    "id": "tipsNode",
    "name": "tipsNode",
    "nodeList": [
        {
            "id": "tips01",
            "type": "datasource",
            "data": {
                "alias": "data.txt",
                "filepath": "./file/data.txt",
                "other": null
            },
            "precursorIds": [
            ],
            "successorIds": [
            ],
            "position": {
                "top": 44,
                "left": 37
            }
        }
    ],
    "connectionList": [
    ]
}