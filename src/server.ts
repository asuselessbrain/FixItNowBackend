import { config } from "../config";
import { seedAdmin } from "../lib/seedAdmin";
import app from "./app";

app.listen(config.port, async () => {
    await seedAdmin();
    console.log(`Server is running on port ${config.port}`);
})