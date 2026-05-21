// @refresh reload
import { StoresProvider } from "@skyjt/store-solid";
import { mount, StartClient } from "@solidjs/start/client";

mount(() => <StartClient />, document.getElementById("app")!);
