import Admin from './Admin'
import KategoriController from './KategoriController'
import ProdukController from './ProdukController'
import TransaksiController from './TransaksiController'
import PengeluaranController from './PengeluaranController'
import PromoController from './PromoController'
import KasirController from './KasirController'
import Settings from './Settings'
const Controllers = {
    Admin: Object.assign(Admin, Admin),
KategoriController: Object.assign(KategoriController, KategoriController),
ProdukController: Object.assign(ProdukController, ProdukController),
TransaksiController: Object.assign(TransaksiController, TransaksiController),
PengeluaranController: Object.assign(PengeluaranController, PengeluaranController),
PromoController: Object.assign(PromoController, PromoController),
KasirController: Object.assign(KasirController, KasirController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers