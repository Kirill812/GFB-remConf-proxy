# GFB-remConf-proxy

A proxy server for the Firebase Remote Config Admin API that makes it easier to develop and prototype frontend interfaces for Remote Config management.

## Features

- RESTful API that provides access to Firebase Remote Config data
- Group-aware parameter organization
- Support for all parameter types (string, number, boolean, JSON)
- Conditional values support
- Version history and rollback capabilities
- Parameter groups management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase Admin SDK credentials file

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kirill812/GFB-remConf-proxy.git
cd GFB-remConf-proxy
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following content:
```
FIREBASE_CREDENTIALS_PATH=/path/to/your/firebase-adminsdk-credentials.json
PORT=3000
```

4. Start the server:
```bash
npm start
```

The server will be running at http://localhost:3000.

## API Endpoints

### Remote Config Templates

- `GET /api/template` - Get the current template
- `PUT /api/template` - Update the template
- `GET /api/metadata` - Get template metadata

### Parameter Groups

- `GET /api/parameter-groups` - List all parameter groups
- `GET /api/parameter-groups/:name` - Get a specific parameter group
- `GET /api/parameter-groups-with-params` - Get all parameter groups with their parameters

### Parameters

- `GET /api/parameters` - List all parameters
- `GET /api/parameters/:name` - Get a specific parameter
- `PUT /api/parameters/:name` - Update a parameter
- `DELETE /api/parameters/:name` - Delete a parameter

### Versioning

- `GET /api/versions` - Get version history
- `GET /api/versions/:version` - Get a specific version
- `POST /api/rollback/:version` - Rollback to a version

## Demo Scripts

The project includes several demo scripts to showcase the API functionality:

- `demo.js` - Displays a tree structure of parameter groups and parameters
- `tests/test-parameter-groups-with-params.js` - Tests the parameter groups with parameters endpoint
- `tests/test-parameter-groups.js` - Tests the parameter groups endpoints

Run the demos with:
```bash
node demo.js
node tests/test-parameter-groups-with-params.js
```

## Parameter Groups with Parameters

The `/api/parameter-groups-with-params` endpoint returns all parameter groups with their respective parameters. This is particularly useful for building UIs that need to display the hierarchical structure of parameters organized by their groups.

The response format is:
```json
{
  "GroupName1": {
    "description": "Optional group description",
    "parameters": {
      "param1": {
        "defaultValue": { "value": "value1" },
        "conditionalValues": { ... },
        "valueType": "STRING"
      },
      "param2": { ... }
    }
  },
  "GroupName2": { ... },
  "Ungrouped": {
    "description": "Parameters not assigned to any group",
    "parameters": { ... }
  }
}
```

## Frontend Development

This API is designed to be used with frontend frameworks for developing Remote Config management interfaces. Examples include:

- PrimeVue components for Vue.js
- React Admin dashboards
- Angular Material tables and forms

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
