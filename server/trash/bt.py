import asyncio
from bleak import BleakScanner

async def scan_devices():
    print("Scanning for Bluetooth devices...")
    devices = await BleakScanner.discover()
    for device in devices:
        print(f"Found device: {device.name} - {device.address}")

asyncio.run(scan_devices())
