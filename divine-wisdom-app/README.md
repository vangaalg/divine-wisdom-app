# Krishna's Divine Wisdom App

An interactive application that provides spiritual guidance based on the divine wisdom of Lord Krishna.

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (v14 or higher recommended)
2. Clone this repository
3. Install dependencies:
   ```
   cd divine-wisdom-app/server
   npm install
   cd ../client
   npm install
   ```

## Running the Application

### Standard Method

To run the application on your local machine:

1. Start the server:
   ```
   cd server
   node server.js
   ```

2. In a separate terminal, start the client:
   ```
   cd client
   npm start
   ```

3. Open your browser to http://localhost:3000

### Using the Startup Scripts

For convenience, you can use the provided scripts:

- Windows: Run `start.bat` or `start-app.ps1` (PowerShell)
- Mac/Linux: Run `./start.sh`

## Hosting on Your Local WiFi Network

To make the app accessible to other devices on your WiFi network:

### Using the WiFi Hosting Scripts

1. Run one of the WiFi hosting scripts:
   - Windows: Run `host-on-wifi.bat` or `host-on-wifi.ps1` (PowerShell)

2. The script will show your local IP address (like `192.168.1.X`)

3. On other devices (phones, tablets, other computers):
   - Connect to the same WiFi network
   - Open a web browser
   - Navigate to the URL shown in the server console (like `http://192.168.1.X:3000`)

### Manual WiFi Network Setup

1. Start the server with network binding:
   ```
   cd server
   export HOST=0.0.0.0 # For Linux/Mac
   set HOST=0.0.0.0 # For Windows
   node server.js
   ```

2. In a separate terminal, start the client with network settings:
   ```
   cd client
   export HOST=0.0.0.0 # For Linux/Mac
   set HOST=0.0.0.0 # For Windows
   export DANGEROUSLY_DISABLE_HOST_CHECK=true # For Linux/Mac
   set DANGEROUSLY_DISABLE_HOST_CHECK=true # For Windows
   npm start
   ```

3. The server will print out the network URL to use from other devices

## Database Setup

The application uses Supabase for data storage. If you encounter database issues, run:

```
cd divine-wisdom-app
.\fix-database.ps1 # Windows PowerShell
# OR
./fix-database.sh # Linux/Mac
```

## Features

- Ask up to three spiritual questions to Lord Krishna
- Receive divine wisdom and guidance
- Support for multiple languages
- Spiritual quotes from the Bhagavad Gita
- Save chats for future reference
- Express appreciation through the like button

## License

This project is licensed under the MIT License - see the LICENSE file for details. 