import "./config/loadEnv.js";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
