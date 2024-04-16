// ioBroker Shelly Servicemeldungen
//
// Version: v0.0.5b
// Ersteller: ioBuchi
// Github: https://github.com/ioBuchi

//// Einstellungen ////

// Servicewerte
const serviceValueRssi    = -90 // Dieser Wert gibt an ab welcher Grenze der RSSI-Wert auslöst.
const serviceValueBattery =  20 // Ab wieviel Prozent Batteriezustand soll eine Servicemeldung angezeigt werden.

// Discord Webhook
const discordEnable     = false;
const discordWebhookUrl = '';
const discordUsername   = 'ioBroker Shelly Service'
const discordAvatar     = 'https://i.ibb.co/dLZYGwC/Iobuchi-logo.png';

// Telegram Webhook
const telegramEnable    = false
const telegramToken     = '';
const telegramchatId    = '';

//// !!!Ab hier nur noch für Experten!!! ////

const scriptVersion = "0.0.5-beta" // Nicht ändern!!!

// States abfragen
let onlineStates   = [];
let rssiStates     = [];
let batteryStates  = [];
let firmwareStates = [];

get_states();
checkLatestVersion(true, scriptVersion)

schedule("*/30 * * * *", async () => {
    checkLatestVersion(false, scriptVersion)
});

function get_states() {
    onlineStates   = Array.prototype.slice.apply($('state[id=shelly.*.online]'));
    rssiStates     = Array.prototype.slice.apply($('state[id=shelly.*.rssi]'));
    batteryStates  = Array.prototype.slice.apply($('state[id=shelly.*.battery]'));
    firmwareStates = Array.prototype.slice.apply($('state[id=shelly.*.firmware]'));

    console.log("Es wurden " + (onlineStates.length + rssiStates.length + batteryStates.length + firmwareStates.length) + " Datenpunkte gefunden.");
}

// Prüfen ob Datenpunkte für die Ausgebe existiren und bei Bedarf neu anlegen
if (!!$("javascript.0.shelly_service.count").length === false) {
    createState('shelly_service.count', parseFloat(0), { type: 'number', read: true, write: true }, async () => {});
    console.log("Neuer Datenpunkt angelegt: javascript.0.shelly_service.count");
}
if (!!$("javascript.0.shelly_service.text").length === false) {
    createState('shelly_service.text', "", { type: 'string', read: true, write: true }, async () => {});
    console.log("Neuer Datenpunkt angelegt: javascript.0.shelly_service.text");
}

// Bei Wertänderung auslösen
on({ id: [].concat(onlineStates).concat(rssiStates).concat(batteryStates).concat(firmwareStates), change: 'ne' }, async (obj) => {
    //console.log("update");
    await get_service_messages();
});

// Servicemeldugen sammeln
async function get_service_messages() {
    var serviceCount = 0;
    var serviceText = "";

    // Onlinezustände abfragen
    for (let i = 0; i < onlineStates.length; i++) {
        if ($(onlineStates[i]).length === 0) {
            get_states();
            console.warn("Datenpunkt " + onlineStates[i] + "existiert nicht mehr. Datenpunkte werden neu abgefragt");
            return;
        } else {
            if (getState(onlineStates[i]).val === false) {
                if (serviceCount > 0) {
                    serviceText += ', ';
                }
                var device_id = onlineStates[i].replace(".online", "");
                serviceCount++
                serviceText += (await getObjectAsync(device_id)).common.name + " ist offline";
            }
        }
        
    }
    // Empfangsstärke abfragen
    for (let i = 0; i < rssiStates.length; i++) {
        if ($(rssiStates[i]).length === 0) {
            get_states();
            console.warn("Datenpunkt " + rssiStates[i] + "existiert nicht mehr. Datenpunkte werden neu abgefragt");
            return;
        } else {
            if (getState(rssiStates[i]).val <= serviceValueRssi) {
                if (serviceCount > 0) {
                    serviceText += ', ';
                }
                var device_id = rssiStates[i].replace(".rssi", "");
                serviceCount++
                serviceText += (await getObjectAsync(device_id)).common.name + " hat einen schlechten Empfang";
            }
        }   
    }
    // Batteriezustände abfragen
    for (let i = 0; i < batteryStates.length; i++) {
        if ($(batteryStates[i]).length === 0) {
            get_states();
            console.warn("Datenpunkt " + batteryStates[i] + "existiert nicht mehr. Datenpunkte werden neu abgefragt");
            return;
        } else {
            if (getState(batteryStates[i]).val <= serviceValueBattery) {
                if (serviceCount > 0) {
                    serviceText += ', ';
                }
                var device_id = batteryStates[i].replace(".battery", "");
                serviceCount++
                serviceText += (await getObjectAsync(device_id)).common.name + " Batterieladung gering (" + batteryStates[i].val + "%)";
            }
        }
    }
    //Firmware-Updates abfragen
    for (let i = 0; i < firmwareStates.length; i++) {
        if ($(firmwareStates[i]).length === 0) {
            get_states();
            console.warn("Datenpunkt " + firmwareStates[i] + " existiert nicht mehr. Datenpunkte werden neu abgefragt");
            return;
        } else {
            if (getState(firmwareStates[i]).val === true) {
                if (serviceCount > 0) {
                    serviceText += ', ';
                }
                var device_id = firmwareStates[i].replace(".firmware", "");
                serviceCount++
                serviceText += (await getObjectAsync(device_id)).common.name + " benötigt ein Firmware-Update";
            }
        }
    }
    //Ausgabedatenpunkte aktualisieren und Webhook triggern
    if (serviceCount === 0) {
        serviceText = "Derzeit keine Servicemeldungen"
    }
    if (getState('javascript.0.shelly_service.count').val != serviceCount) {
        setState('javascript.0.shelly_service.count', serviceCount);
    }
    if (getState('javascript.0.shelly_service.text').val != serviceText) {
        setState('javascript.0.shelly_service.text', serviceText);
        if (discordEnable) {
            await sendToDiscordWebhook(serviceText);
        }
        if (telegramEnable) {
            await sendToTelegramWebhook(serviceText);
        }
    }
}

// Discord Webhook
var axios = require('axios');

async function sendToDiscordWebhook(message) {
    var data = {
        content: message,
        username: discordUsername,
        avatar_url: discordAvatar
    }

    try {
      var response = await axios.post(discordWebhookUrl, data);
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht an Discord:', error.message);
    }
}

// Telegram Webhook

async function sendToTelegramWebhook(message) {
        axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        chat_id: telegramchatId,
        text: message
    })
    .then(response => {
        // console.log('Nachricht gesendet:', response.data);
    })
    .catch(error => {
        console.error('Fehler beim Senden der Nachricht:', error);
    });
}

// Funktion zum Abrufen der neuesten Release-Version von GitHub
const request = require('request');

function checkLatestVersion(scriptStart, installedVersion) {
    const options = {
        url: `https://api.github.com/repos/ioBuchi/ioBroker_Shelly_Servicemeldungen/releases/latest`,
        headers: {
            'User-Agent': 'ioBrokerShellyService' // GitHub-API erfordert einen User-Agent
        }
    };

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const latestRelease = JSON.parse(body);
            const latestVersion = latestRelease.tag_name.replace('v', ''); // Formatieren der Version, falls nötig
            if (latestVersion === installedVersion) {
                if (scriptStart) {
                    console.log("Du nutzt die aktuelle Version");
                }
            } else {
                console.warn("Es ist eine neue Version verfügbar. Deine aktuelle Version ist " + installedVersion + ". Die neuste Version ist: " + latestVersion + ".")
            }
        } else {
            console.warn(`Failed to fetch latest version: ${response.statusCode}`);
        }
    });
}