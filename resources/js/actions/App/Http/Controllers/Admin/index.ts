import DashboardController from './DashboardController'
import UserController from './UserController'
import LaporanController from './LaporanController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
UserController: Object.assign(UserController, UserController),
LaporanController: Object.assign(LaporanController, LaporanController),
}

export default Admin