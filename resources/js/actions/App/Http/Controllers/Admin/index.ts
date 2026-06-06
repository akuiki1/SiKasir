import DashboardController from './DashboardController'
import UserController from './UserController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
UserController: Object.assign(UserController, UserController),
}

export default Admin