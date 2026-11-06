import "server-only"
import {loadDashboard} from "./dashboard-domain"
import {readFebadcoSheets} from "./sheets-server"
export function loadRealDashboard(){return loadDashboard(readFebadcoSheets)}
