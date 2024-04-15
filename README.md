# ioBroker Shelly Servicemeldungen (Blockly-Skript)

## Beschreibung
Dieses Skript automatisiert das Auslesen von Datenpunkten der Typen "online", "rssi", "battery" und "firmware" von allen Shelly-Geräten im ioBroker und überprüft, ob Servicemeldungen vorliegen. Beim ersten Start des Skripts werden zwei Datenpunkte angelegt ("javascript.0.shelly_service.ssm" und "javascript.0.shelly_service.ssm_text"). Diese Datenpunkte werden bei jeder Zustandsänderung aktualisiert.

## Vorraussetzungen
- ioBroker JavaScript-Adapter
- ioBroker Shelly-Adapter

## Installation
1. Erstelle einen neuen Blockly-Skript im ioBroker. Der Name des Skripts kann frei gewählt werden.
2. Klicke auf Blöcke importieren.
3. Füge den Code aus der Datei "blockly.xml" ein.
4. Starte den Skript.
5. (Optional) Wenn du eine Discord-Webhook benutzen willst, kannst du noch die eine Discord-Webhook-Adresse eingeben.

## Datenpunkte in vis einbinden
- Anzahl an Servicemeldungen:
```html
{javascript.0.shelly_service.count}
````
- Servicemeldungen als Text:
```html
{a:javascript.0.shelly_service.text;a.replace(/,/g,"<br>")}
```

## Haftungsausschluss:
Die Nutzung dieses Scripts erfolgt auf eigene Gefahr. Es wird ausdrücklich darauf hingewiesen, dass keinerlei Haftung für Schäden jeglicher Art übernommen wird, die durch die Verwendung dieses Scripts entstehen könnten. Dies schließt, ohne Einschränkung, direkte, indirekte, zufällige und Folgeschäden ein.

Das Script wird ohne jegliche Gewährleistung bereitgestellt.

Der Nutzer trägt die alleinige Verantwortung für die Verwendung dieses Scripts und ist dafür verantwortlich sicherzustellen, dass es seinen individuellen Anforderungen entspricht. Es wird empfohlen, vor der Verwendung des Scripts eine gründliche Überprüfung durchzuführen und gegebenenfalls fachkundigen Rat einzuholen.

Durch die Nutzung dieses Scripts erklärt der Nutzer sein Einverständnis mit diesem Haftungsausschluss.
