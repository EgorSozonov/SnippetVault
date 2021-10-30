import App from "./App"


// Process.env will always be comprised of strings, so we typecast the port to a
// number.
const PORT = Number(process.env.PORT) || 47000;

App.listen(PORT);