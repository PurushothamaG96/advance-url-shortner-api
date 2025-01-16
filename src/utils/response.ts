import { UniqueDevices } from "../entities/uniqueDevices";
import { UniqueOS } from "../entities/uniqueOs";
import { DeviceType, OSType } from "../interface/response";
import { DeviceAccumulator, OSAccumulator } from "../interface/url";

export function processOs(uniqueOS: UniqueOS[]): OSType[] {
  // OS analytics
  const osAccumulator = uniqueOS.reduce<OSAccumulator>((acc, os) => {
    if (!acc[os.osName]) {
      acc[os.osName] = [];
    }
    acc[os.osName].push(os);
    return acc;
  }, {});

  const osType = Object.entries(osAccumulator).map(([osName, osEntries]) => {
    const uniqueClicks = osEntries.length;
    const uniqueUsers = new Set(osEntries.map((os) => os.accessUserId)).size;
    return {
      osName,
      uniqueClicks,
      uniqueUsers,
    };
  });

  return osType;
}

export function processDeviceType(
  uniqueDevices: UniqueDevices[]
): DeviceType[] {
  // Device analytics
  const deviceAccumulator = uniqueDevices.reduce<DeviceAccumulator>(
    (acc, device) => {
      if (!acc[device.deviceName]) {
        acc[device.deviceName] = [];
      }
      acc[device.deviceName].push(device);
      return acc;
    },
    {}
  );

  const deviceType = Object.entries(deviceAccumulator).map(
    ([deviceName, deviceEntries]) => {
      const uniqueClicks = deviceEntries.length;
      const uniqueUsers = new Set(
        deviceEntries.map((device) => device.accessUserId)
      ).size;
      return {
        deviceName,
        uniqueClicks,
        uniqueUsers,
      };
    }
  );

  return deviceType;
}
