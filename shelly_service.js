// ioBroker Shelly Servicemeldungen
//
// Version: v0.0.1b
// Ersteller: ioBuchi
// Github: https://github.com/ioBuchi

//// Einstellungen ////

// Servicewerte
var service_value_rssi    = -80 // Dieser Wert gibt an ab welcher Grenze der RSSI-Wert auslöst.
var service_value_battery =  20 // Ab wieviel Prozent Batteriezustand soll eine Servicemeldung angezeigt werden.

// Discord Webhook
var discord_enable     = false;
var discord_webhookUrl = '';
var discord_username   = 'ioBroker Shelly Service'
var discord_avatar     = 'https://i.ibb.co/dLZYGwC/Iobuchi-logo.png';

//// !!!Ab hier nur noch für Experten!!! ////

// States abfragen
var online_states   = Array.prototype.slice.apply($('state[id=shelly.0.*.online]'));
var rssi_states     = Array.prototype.slice.apply($('state[id=shelly.0.*.rssi]'));
var battery_states  = Array.prototype.slice.apply($('state[id=shelly.0.*.battery]'));
var firmware_states = Array.prototype.slice.apply($('state[id=shelly.0.*.firmware]'));

console.log("Es wurden " + (online_states.length + rssi_states.length + battery_states.length + firmware_states.length) + " Datenpunkte gefunden.");

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
on({ id: [].concat(online_states).concat(rssi_states).concat(battery_states).concat(firmware_states), change: 'ne' }, async (obj) => {
    //console.log("update");
    await get_service_messages();
});

// Servicemeldugen sammeln
async function get_service_messages() {
    var service_count = 0;
    var service_text = "";

    // Onlinezustände abfragen
    for (let i = 0; i < online_states.length; i++) {
        if (getState(online_states[i]).val === false) {
            if (service_count > 0) {
                service_text += ', ';
            }
            var device_id = online_states[i].replace(".online", "");
            service_count++
            service_text += (await getObjectAsync(device_id)).common.name + " ist offline";
        }
    }
    // Empfangsstärke abfragen
    for (let i = 0; i < rssi_states.length; i++) {
        if (getState(rssi_states[i]).val <= service_value_rssi) {
            if (service_count > 0) {
                service_text += ', ';
            }
            var device_id = rssi_states[i].replace(".rssi", "");
            service_count++
            service_text += (await getObjectAsync(device_id)).common.name + " hat einen schlechten Empfang";
        }
    }
    // Batteriezustände abfragen
    for (let i = 0; i < battery_states.length; i++) {
        if (getState(battery_states[i]).val <= service_value_battery) {
            if (service_count > 0) {
                service_text += ', ';
            }
            var device_id = battery_states[i].replace(".battery", "");
            service_count++
            service_text += (await getObjectAsync(device_id)).common.name + " Batterieladung gering (" + battery_states[i].val + "%)";
        }
    }
    //Firmware-Updates abfragen
    for (let i = 0; i < firmware_states.length; i++) {
        if (getState(firmware_states[i]).val === true) {
            if (service_count > 0) {
                service_text += ', ';
            }
            var device_id = firmware_states[i].replace(".firmware", "");
            service_count++
            service_text += (await getObjectAsync(device_id)).common.name + " benötigt ein Firmware-Update";
        }
    }
    //Ausgabedatenpunkte aktualisieren und Webhook triggern
    if (service_count === 0) {
        service_text = "Derzeit keine Servicemeldungen"
    }
    if (getState('javascript.0.shelly_service.count').val != service_count) {
        setState('javascript.0.shelly_service.count', service_count);
    }
    if (getState('javascript.0.shelly_service.text').val != service_text) {
        setState('javascript.0.shelly_service.text', service_text);
        if (discord_enable) {
            await sendToDiscordWebhook(service_text);
        }
    }
}

// Discord Webhook
var axios = require('axios');

async function sendToDiscordWebhook(message) {
    var data = {
        content: message,
        username: discord_username,
        avatar_url: discord_avatar
    }

    try {
      var response = await axios.post(discord_webhookUrl, data);
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht an Discord:', error.message);
    }
}