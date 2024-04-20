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

## Datenpunkte
| Datenpunkt    | Beschreibung  |
| ------------- | ------------- |
| "javascript.0.shelly_service.count" | Anzahl der aktuell anstehenden Servicemeldungen |
| "javascript.0.shelly_service.text" | Servicemeldungen als Text |
| "javascript.0.shelly_service.settings.general.valueBattery" | Wert ab wann eine Batteriestörung erkannt werden soll |
| "javascript.0.shelly_service.settings.general.valueRSSI" | Wert ab wann ein schlechter Empfang erkannt werden soll. Je kleiner der Wert, desto schlechter der Empfang |
| "javascript.0.shelly_service.settings.discord.enable" | Datenpunkt um die Webhook über Discord zu aktivieren |
| "javascript.0.shelly_service.settings.telegram.enable" | Datenpunkt um die Webhook über Telegram zu aktivieren |

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
