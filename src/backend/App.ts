
import { PORT } from "../common/web/Url";
import SVServer from "./server/SVServer"


// Process.env will always be comprised of strings, so we typecast the port to a number.
//const PORT = Number(process.env.PORT) || 47000;


SVServer.listen(PORT);