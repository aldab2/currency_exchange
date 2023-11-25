let devices = [
    {
      "name": "Smart Lamp 1",
      "id": "device001",
      "roomId": "roomA",
      "type": "lamp",
      "brightness": 75,
      "enabled": true
    },
    {
      "name": "Thermostat 1",
      "id": "device002",
      "roomId": "roomB",
      "type": "thermostat",
      "enabled": true
    },
    {
      "name": "Smart Lamp 2",
      "id": "device003",
      "roomId": "roomA",
      "type": "lamp",
      "brightness": 50,
      "enabled": false
    }
  ]


let rooms = [
    {
      "roomId": "roomA",
      "name": "Living Room",
      "iotDevices": ["device001", "device003"]
    },
    {
      "roomId": "roomB",
      "name": "Bedroom",
      "iotDevices": ["device002"]
    }
  ]

  export {rooms,devices}