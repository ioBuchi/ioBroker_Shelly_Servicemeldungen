# ioBroker Shelly Servicemeldungen

## Beschreibung
Dieses Skript automatisiert das Auslesen von Datenpunkten der Typen "online", "rssi", "battery" und "firmware" von allen Shelly-Geräten im ioBroker und überprüft, ob Servicemeldungen vorliegen. Beim ersten Start des Skripts werden zwei Datenpunkte angelegt ("javascript.0.shelly_service.count" und "javascript.0.shelly_service.text"). Diese Datenpunkte werden bei jeder Zustandsänderung aktualisiert.

## Vorraussetzungen
- ioBroker JavaScript-Adapter
- ioBroker Shelly-Adapter

## Installation
1. Erstelle einen neuen JavaScript im ioBroker.
2. Füge den Code aus der Datei "shelly_service.js" ein.
3. Starte den Skript.

## Webhooks
- [Discord Webhook erstellen](https://support.discord.com/hc/de/articles/228383668-Einleitung-in-Webhooks)
- [Telegram Chatbot erstellen](https://www.netzwelt.de/anleitung/176027-telegram-so-erstellt-bot.html)
- [Telegram Chat ID herausfinden](https://gist.github.com/nafiesl/4ad622f344cd1dc3bb1ecbe468ff9f8a)

## Datenpunkte

"javascript.0.shelly_service."

| Datenpunkt    | Beschreibung  | Standardwert | Typ |
| ------------- | ------------- | ------------- | ------------- |
| count | Anzahl der aktuell anstehenden Servicemeldungen | 0 | number |
| text | Servicemeldungen als Text | "" | string |

"javascript.0.shelly_service.settings.general."

| Datenpunkt    | Beschreibung  | Standardwert | Typ |
| ------------- | ------------- | ------------- | ------------- |
| valueBattery | Wert ab wann eine Batteriestörung erkannt werden soll | 20 | number |
| valueRSSI | Wert ab wann ein schlechter Empfang erkannt werden soll. Je kleiner der Wert, desto schlechter der Empfang | -90 | number |

"javascript.0.shelly_service.settings.discord."

| Datenpunkt    | Beschreibung  | Standardwert | Typ |
| ------------- | ------------- | ------------- | ------------- |
| enable | Datenpunkt um die Webhook über Discord zu aktivieren | false | boolean |

"javascript.0.shelly_service.settings.telegram."

| Datenpunkt    | Beschreibung  | Standardwert | Typ |
| ------------- | ------------- | ------------- | ------------- |
| enable | Datenpunkt um die Webhook über Telegram zu aktivieren | false | boolean |

## Datenpunkte in vis einbinden
- Anzahl an Servicemeldungen:
```html
{javascript.0.shelly_service.count}
````
- Servicemeldungen als Text:
```html
{a:javascript.0.shelly_service.text;a.replace(/,/g,"<br>")}
```

## Changelog
### v0.0.7b
- Die Warnmeldung beim Schreiben der Ausgabewerte wurde behoben

### v0.0.6b
- Die Einstellungen für die Webhooks sowie die Werte für "RSSI" und "Battery" können nun über Datenpunkte aktualisiert werden
- Kleine Verbesserungen an der Struktur des Skripts

!!! Wichtiger Hinweis !!!

Die Struktur der Datenpunkte wurde verändert. Wenn du eine ältere Version installiert hast, lösche bitte zuerst den kompletten Objektbaum "javascript.0.selly_service"

### v0.0.5b 
- Das Script prüft jetzt automatisch ob auf Github eine neue Version zur verfügung steht.

### v0.0.4b 
- Telegram Webhook hinzugefügt

### v0.0.3b
- Anpassung der Variablennamen

### v0.0.2b
- Wenn ein Shellygerät gelöscht wird, wird dies nun automatisch vom Skript erkannt, woraufhin eine erneute Abfrage der vorhandenen Datapunkte initiiert wird.
- Anpassungen der Variablen wurden vorgenommen.

## Haftungsausschluss:
Die Nutzung dieses Scripts erfolgt auf eigene Gefahr. Es wird ausdrücklich darauf hingewiesen, dass keinerlei Haftung für Schäden jeglicher Art übernommen wird, die durch die Verwendung dieses Scripts entstehen könnten. Dies schließt, ohne Einschränkung, direkte, indirekte, zufällige und Folgeschäden ein.

Das Script wird ohne jegliche Gewährleistung bereitgestellt.

Der Nutzer trägt die alleinige Verantwortung für die Verwendung dieses Scripts und ist dafür verantwortlich sicherzustellen, dass es seinen individuellen Anforderungen entspricht. Es wird empfohlen, vor der Verwendung des Scripts eine gründliche Überprüfung durchzuführen und gegebenenfalls fachkundigen Rat einzuholen.

Durch die Nutzung dieses Scripts erklärt der Nutzer sein Einverständnis mit diesem Haftungsausschluss.
