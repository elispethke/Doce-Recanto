import { resetEmulatorData } from "./fixtures/firebase-admin";

export default async function globalSetup() {
  await resetEmulatorData();
}
