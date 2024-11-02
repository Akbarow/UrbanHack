const fetch = require('node-fetch');

function getRoute(origin, destination) {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const apiKey = 'AIzaSyCBO21rLwbAi6SXdrVV4zjAElshi0f3VVU';

    const requestData = {
        origin: {
            location: {
                latLng: {
                    latitude: origin.latitude,
                    longitude: origin.longitude
                }
            }
        },
        destination: {
            location: {
                latLng: {
                    latitude: destination.latitude,
                    longitude: destination.longitude
                }
            }
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false
        },
        languageCode: 'en-US',
        units: 'IMPERIAL'
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        },
        body: JSON.stringify(requestData)
    })
  }

  async function fetch() {
    // const originPoint = { latitude: 37.419734, longitude: -122.0827784 };
    // const destinationPoint = { latitude: 37.417670, longitude: -122.079595 };
    // const result = await(await getRoute(originPoint, destinationPoint)).json();
    const distances = {};
    for(let i = 0; i < vertices.length; i++) {
      for(let j = i + 1; j < vertices.length; j++) {
        const vertexOne = vertices[i];
        const vertexTwo = vertices[j];
        const keyOne = `${vertexOne.name}${vertexTwo.name}`;
        const keyTwo = `${vertexTwo.name}${vertexOne.name}`;
        const result = await getEdge(vertexOne, vertexTwo);
        distances[keyOne] = { from: vertexOne.name, to: vertexTwo.name, distanceInMeters: result.distanceInMeters, duration: result.duration };
        distances[keyTwo] = { from: vertexTwo.name, to: vertexOne.name, distanceInMeters: result.distanceInMeters, duration: result.duration };
        fs.writeFileSync("distances.json", JSON.stringify(distances, null, 4));
        console.log(result)
      }
    }
  }
  
  async function fetchFromA() {
    // const originPoint = { latitude: 37.419734, longitude: -122.0827784 };
    // const destinationPoint = { latitude: 37.417670, longitude: -122.079595 };
    // const result = await(await getRoute(originPoint, destinationPoint)).json();
    const distances = {};
      for(let j = 0; j < vertices.length; j++) {
        const vertexOne = startingVertex;
        const vertexTwo = vertices[j];
        const keyOne = `${vertexOne.name}${vertexTwo.name}`;
        const keyTwo = `${vertexTwo.name}${vertexOne.name}`;
        const result = await getEdge(vertexOne, vertexTwo);
        distances[keyOne] = { from: vertexOne.name, to: vertexTwo.name, distanceInMeters: result.distanceInMeters, duration: result.duration };
        distances[keyTwo] = { from: vertexTwo.name, to: vertexOne.name, distanceInMeters: result.distanceInMeters, duration: result.duration };
        fs.writeFileSync("distancesFromA.json", JSON.stringify(distances, null, 4));
        console.log(result)
      }
  }

  
  module.exports = {
    getRoute
  }