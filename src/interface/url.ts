import { UniqueDevices } from "../schema/device";
import { UniqueOS } from "../schema/os";

export interface OSAccumulator {
  [osName: string]: UniqueOS[];
}

export interface DeviceAccumulator {
  [deviceName: string]: UniqueDevices[];
}

export interface uniqueDateAccumulator {
  [date: string]: number;
}

export interface TopicAccumulator {
  totalClicks: number;
  uniqueUsers: Set<string>;
  clicksByDate: Map<string, number>;
  urls: Array<{
    shortUrl: string;
    totalClicks: number;
    uniqueUsers: number;
  }>;
}

export interface OverallAccumulator {
  totalClicks: number;
  uniqueUsers: Set<string>;
  clicksByDate: Map<string, number>;
  deviceType: UniqueDevices[] | any[];
  osType: UniqueOS[] | any[];
}
