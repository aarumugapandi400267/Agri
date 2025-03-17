import noble from 'noble-winrt';

noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        console.log("Scanning for devices...");
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', (peripheral) => {
    console.log(`Found device: ${peripheral.advertisement.localName} - ${peripheral.id}`);
    noble.stopScanning();
});
