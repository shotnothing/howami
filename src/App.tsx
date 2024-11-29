import StaticStats from "./StaticStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useState } from "react";

declare global {
  interface Navigator {
    getBattery: any;
    getInstalledRelatedApps: any;
  }
}

interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

interface RelatedApplication {
  id: string;
  platform: string;
}

function App() {
  const navigatorMethods = {
    "canShare": navigator.canShare.bind(navigator),
    "getBattery": navigator.getBattery ? navigator.getBattery.bind(navigator) : "not supported",
    "getGamepads": navigator.getGamepads.bind(navigator),
    "getInstalledRelatedApps": navigator.getInstalledRelatedApps ? navigator.getInstalledRelatedApps.bind(navigator) : "not supported",
    "share": navigator.share.bind(navigator),
    "vibrate": navigator.vibrate.bind(navigator),
  }

  const [battery, setBattery] = useState<BatteryManager | null>(null);
  const [relatedApps, setRelatedApps] = useState<RelatedApplication[]>([]);

  return (
    <>
      <Toaster />
      <Tabs defaultValue="Properties">
        <TabsList>
          <TabsTrigger value="Properties">Properties</TabsTrigger>
          <TabsTrigger value="Methods">Methods</TabsTrigger>
        </TabsList>
        <TabsContent value="Properties">
          <StaticStats />
        </TabsContent>
        <TabsContent value="Methods">
          {Object.entries(navigatorMethods).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>navigator.{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row gap-2">
                  <Button
                    onClick={() => {
                      let result = "No Result";
                      switch (key) {
                        case "vibrate":
                          result = value(500);
                          break;
                        case "share":
                        case "canShare":
                          result = value({
                            title: "Test Share",
                            text: "This is a test share",
                          });
                          break;
                        case "getBattery":
                          result = "Waiting for promise";
                          value().then((battery: BatteryManager) => {
                            setBattery(battery);
                            toast(`Fetched battery`);
                          });
                          break;
                        case "getInstalledRelatedApps":
                          result = "Waiting for promise";
                          value().then((relatedApps: RelatedApplication[]) => {
                            setRelatedApps(relatedApps);
                            toast(`Fetched related apps`);
                          });
                          break;
                        default:
                          result = value();
                          break;
                      }
                      console.log(result);
                      toast(`${key} returned ${result}`);
                    }}
                  >Invoke</Button>
                  {key === "getBattery" && battery && (
                    <div>
                      <p>Battery.level: {battery.level}</p>
                      <p>Battery.charging: {battery.charging ? "true" : "false"}</p>
                      <p>Battery.chargingTime: {battery.chargingTime}</p>
                      <p>Battery.dischargingTime: {battery.dischargingTime}</p>
                    </div>
                  )}
                  {key === "getInstalledRelatedApps" && relatedApps.length > 0 && (
                    <div>
                      <p>Related Apps: {relatedApps.map(app => app.id).join(", ")}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

    </>
  )
}

export default App