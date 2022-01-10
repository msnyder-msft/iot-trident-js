export const mockVConfig = {
    type: 'ViewerConfigurationDoc',
    viewerConfiguration: {
        scenes: [
            {
                type: 'Scene',
                id: '58e02362287440d9a5bf3f8d6d6bfcf9',
                displayName: 'TruckAndBoxes1',
                latitude: 45,
                longitude: 45,
                twinToObjectMappings: [
                    {
                        id: '5ba433d52b8445979fabc818fd40ae3d',
                        displayName: 'leftWheels',
                        primaryTwinID: 'Truck05',
                        meshIDs: ['wheel1Mesh', 'wheel2Mesh']
                    },
                    {
                        id: '2aa6955f3c73418a9be0f7b19c019b75',
                        displayName: 'rightWheels',
                        primaryTwinID: 'Truck05',
                        meshIDs: ['wheel3Mesh', 'wheel4Mesh']
                    },
                    {
                        id: '4cb0990d646a4bbea3e1102676e200fe',
                        displayName: 'tank',
                        primaryTwinID: 'Tank08',
                        meshIDs: ['tankMesh'],
                        twinAliases: {
                            temperatureTag: 'Tag09DF'
                        }
                    },
                    {
                        id: '0c785dde26664341b1f391a4e1b35180',
                        displayName: 'box1',
                        primaryTwinID: 'BoxA',
                        meshIDs: ['boxLid1Mesh', 'boxBody1Mesh']
                    },
                    {
                        id: 'ceb934ac64744c0b8fbb72aaea29e99e',
                        displayName: 'box2',
                        primaryTwinID: 'BoxB',
                        meshIDs: ['boxLid2Mesh', 'boxBody2Mesh']
                    }
                ],
                behaviors: [
                    'wheelsTooLow',
                    'tankTooHot',
                    'boxTooHot',
                    'engineTooHot'
                ],
                assets: [
                    {
                        type: 'Asset3D',
                        name: 'TruckAndBoxes',
                        url:
                            'https://cardboardresources.blob.core.windows.net/cardboard-mock-files/TruckBoxesEnginesPastmachine.gltf'
                    }
                ]
            }
        ],
        behaviors: [
            {
                id: 'wheelsTooLow',
                type: 'Behavior',
                layers: ['PhysicalProperties'],
                datasources: [
                    {
                        type: 'TwinToObjectMappingDatasource',
                        mappingIDs: [
                            '5ba433d52b8445979fabc818fd40ae3d',
                            '2aa6955f3c73418a9be0f7b19c019b75'
                        ]
                    }
                ],
                visuals: [
                    {
                        type: 'ColorChange',
                        color: {
                            type: 'BindingExpression',
                            expression:
                                "primaryTwin.avgTirePressure < 28 ? 'red' : 'green'"
                        },
                        elementIDs: {
                            type: 'MeshIDArray',
                            expression: 'meshIDs'
                        }
                    },
                    {
                        type: 'OnClickPopover',
                        widgets: [
                            {
                                type: 'Gauge',
                                controlConfiguration: {
                                    valueBreakPoints: [0, 50, 100],
                                    expression: 'primaryTwin.avgTirePressure',
                                    label: 'Average Tire Pressure'
                                }
                            },
                            {
                                type: 'Link',
                                controlConfiguration: {
                                    expression:
                                        'https://mypowerbi.biz/${primaryTwin.displayName}'
                                }
                            }
                        ],
                        elementIDs: {
                            type: 'MeshIDArray',
                            expression: 'meshIDs'
                        }
                    }
                ]
            },
            {
                id: 'tankTooHot',
                type: 'Behavior',
                layers: ['PhysicalProperties'],
                twinAliases: ['temperatureTag'],
                datasources: [
                    {
                        type: 'TwinToObjectMappingDatasource',
                        mappingIDs: ['4cb0990d646a4bbea3e1102676e200fe']
                    }
                ],
                visuals: [
                    {
                        type: 'ColorChange',
                        color: {
                            type: 'BindingExpression',
                            expression:
                                "twinAliases.temperatureTag.value > 100 ? 'red' : 'green'"
                        },
                        elementIDs: {
                            type: 'MeshIDArray',
                            expression: 'meshIDs'
                        }
                    },
                    {
                        type: 'Label',
                        label: {
                            type: 'BindingExpression',
                            visibleWhen: 'temperatureTag.value > 100',
                            expression: 'primaryTwin.displayName is too hot!'
                        },
                        elementIDs: {
                            type: 'MeshIDArray',
                            expression: 'meshIDs'
                        }
                    }
                ]
            },
            {
                id: 'boxTooHot',
                type: 'Behavior',
                layers: ['PhysicalProperties'],
                datasources: [
                    {
                        type: 'FilteredTwinDatasource',
                        twinFilterQuery:
                            "SELECT box FROM DIGITALTWINS engine WHERE IS_OF_MODEL(box,'dtmi:example:Box;1') and box.$dtid IN [twinToObjectMappings.map(om => om.primaryTwinID)]",
                        messageFilter: '*',
                        twinFilterSelector: 'box'
                    }
                ],
                visuals: [
                    {
                        type: 'ColorChange',
                        color: {
                            type: 'BindingExpression',
                            expression:
                                "primaryTwin.boxTemp > 80 ? 'red' : 'green'"
                        },
                        elementIDs: {
                            type: 'MeshIDArray',
                            expression: 'meshIDs'
                        }
                    }
                ]
            },
            {
                id: 'engineTooHot',
                type: 'Behavior',
                layers: ['EngineProperties'],
                datasources: [
                    {
                        type: 'FilteredTwinDatasource',
                        twinFilterQuery:
                            "SELECT engine FROM DIGITALTWINS engine WHERE IS_OF_MODEL(engine,'dtmi:example:Engine;1')",
                        messageFilter: '*',
                        twinFilterSelector: 'engine'
                    }
                ],
                visuals: [
                    {
                        type: 'ColorChange',
                        color: {
                            type: 'BindingExpression',
                            expression:
                                "data.engine.temperature > 70 ? 'green' : 'red'"
                        },
                        elementIDs: {
                            type: 'BindingExpression',
                            expression: '[data.engine.meshId]'
                        }
                    }
                ]
            }
        ]
    }
};