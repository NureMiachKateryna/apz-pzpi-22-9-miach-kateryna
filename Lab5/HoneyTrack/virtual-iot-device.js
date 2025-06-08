// virtual-iot-device.js
const axios = require('axios');


const SERVER_URL = "http://localhost:3000/api/sensor-readings"; 
const SENSOR_ID = "VIRTUAL_DHT_01"; 
const SEND_INTERVAL_MS = 15000; 


let currentTemperature = 22.0; 
let currentHumidity = 55.0;

function getSimulatedSensorData() {

    const tempChange = (Math.random() - 0.5) * 0.5; 
    const humChange = (Math.random() - 0.5) * 1.0;   

    currentTemperature += tempChange;
    currentHumidity += humChange;

    
    if (currentTemperature < 15) currentTemperature = 15.0;
    if (currentTemperature > 30) currentTemperature = 30.0;
    if (currentHumidity < 40) currentHumidity = 40.0;
    if (currentHumidity > 70) currentHumidity = 70.0;

    return {
        temperature: parseFloat(currentTemperature.toFixed(1)), 
        humidity: parseFloat(currentHumidity.toFixed(1))
    };
}

// Функція для надсилання даних на сервер
async function sendData(sensorId, valueType, value) {
    const payload = {
        sensor_id: sensorId,
        value_type: valueType,
        value: value 
    };

    try {
        console.log(`[${new Date().toLocaleTimeString()}] Sending data: ${valueType} = ${value}°C/RH% for sensor ${sensorId}`);
        const response = await axios.post(SERVER_URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`[${new Date().toLocaleTimeString()}] Server response for ${valueType}: ${response.status} - ${JSON.stringify(response.data)}`);
    } catch (error) {
        let errorMessage = `Error sending ${valueType} data: `;
        if (error.response) {
            errorMessage += `${error.response.status} - ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
            errorMessage += `No response from server. Is the server running at ${SERVER_URL}?`;
        } else {
            errorMessage += error.message;
        }
        console.error(`[${new Date().toLocaleTimeString()}] ${errorMessage}`);
    }
}

// Головна функція, яка періодично надсилає дані
async function runVirtualDevice() {
    console.log(`Virtual IoT Device [${SENSOR_ID}] started.`);
    console.log(`Will send data to ${SERVER_URL} every ${SEND_INTERVAL_MS / 1000} seconds.`);
    console.log("-----------------------------------------------------");

    const sendCycle = async () => {
        const data = getSimulatedSensorData();
        await sendData(SENSOR_ID, "temperature", data.temperature);
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        await sendData(SENSOR_ID, "humidity", data.humidity);
    };

    // Перший запуск одразу
    await sendCycle();

    // Подальші запуски за інтервалом
    setInterval(sendCycle, SEND_INTERVAL_MS);
}

// Перевірка, чи запущено сервер API 
async function checkApiAvailability() {
    try {
        await axios.get(SERVER_URL.substring(0, SERVER_URL.lastIndexOf('/api') + 4)); 
        console.log("API server is available. Starting virtual device...");
        runVirtualDevice();
    } catch (error) {
        console.error(`API server at ${SERVER_URL.substring(0, SERVER_URL.lastIndexOf('/api') + 4)} is not responding.`);
        console.error("Please ensure your backend server (app.js from Lab 2) is running.");
        console.error("Details:", error.message);
    }
}

checkApiAvailability();