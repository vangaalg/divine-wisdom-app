#!/bin/bash

# Krishna's Divine Wisdom - WiFi Network Hosting
echo -e "\033[1;32mKrishna's Divine Wisdom - WiFi Network Hosting\033[0m"
echo -e "\033[1;32m==============================================\033[0m"
echo ""

# Display IP information for user
echo -e "\033[1;33mYour network interfaces:\033[0m"
if command -v ifconfig &> /dev/null; then
    ifconfig | grep "inet " | grep -v 127.0.0.1
else
    # Alternative for systems without ifconfig
    ip -4 addr show | grep inet | grep -v 127.0.0.1
fi

echo ""
echo -e "\033[1;36mUse one of the IP addresses above when connecting from other devices\033[0m"
echo ""

# Navigate to server directory
if [ -d "server" ]; then
    cd server
else
    echo "Error: Server directory not found."
    exit 1
fi

echo -e "\033[1;33mStarting server...\033[0m"
# Start in background, redirecting output
export HOST=0.0.0.0
node server.js > ../server-output.log 2>&1 &
SERVER_PID=$!

echo -e "\033[1;33mWaiting for server to initialize...\033[0m"
sleep 5

# Navigate to client directory
cd ../client

echo -e "\033[1;33mStarting client...\033[0m"
# Start client with network settings
export HOST=0.0.0.0
export DANGEROUSLY_DISABLE_HOST_CHECK=true
npm start > ../client-output.log 2>&1 &
CLIENT_PID=$!

echo ""
echo -e "\033[1;32mBoth server and client have been started!\033[0m"
echo -e "\033[1;36mServer output is being saved to: server-output.log\033[0m"
echo -e "\033[1;36mClient output is being saved to: client-output.log\033[0m"
echo ""
echo -e "\033[1;36mFor other devices on your WiFi network:\033[0m"
echo -e "\033[1;36m1. Make sure all devices are connected to the same WiFi network\033[0m"
echo -e "\033[1;36m2. On other devices, open a web browser and navigate to:\033[0m"
echo -e "\033[1;36m   http://YOUR_IP_ADDRESS:3000  (replace YOUR_IP_ADDRESS with one of the above)\033[0m"
echo ""
echo -e "\033[1;33mPress Ctrl+C to stop the server and client\033[0m"

# Handle cleanup when script is terminated
cleanup() {
    echo ""
    echo -e "\033[1;33mStopping server and client...\033[0m"
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo -e "\033[1;32mServer and client have been stopped\033[0m"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done 