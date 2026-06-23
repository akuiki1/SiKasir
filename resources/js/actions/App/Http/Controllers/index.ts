import PesananPublikController from './PesananPublikController'
import Admin from './Admin'
import KategoriController from './KategoriController'
import PelangganController from './PelangganController'
import ProdukController from './ProdukController'
import TransaksiController from './TransaksiController'
import PengeluaranController from './PengeluaranController'
import StokController from './StokController'
import ProduksiController from './ProduksiController'
import PromoController from './PromoController'
import PesananController from './PesananController'
import KasirController from './KasirController'
import Settings from './Settings'
const Controllers = {
    PesananPublikController: Object.assign(PesananPublikController, PesananPublikController),
Admin: Object.assign(Admin, Admin),
KategoriController: Object.assign(KategoriController, KategoriController),
PelangganController: Object.assign(PelangganController, PelangganController),
ProdukController: Object.assign(ProdukController, ProdukController),
TransaksiController: Object.assign(TransaksiController, TransaksiController),
PengeluaranController: Object.assign(PengeluaranController, PengeluaranController),
StokController: Object.assign(StokController, StokController),
ProduksiController: Object.assign(ProduksiController, ProduksiController),
PromoController: Object.assign(PromoController, PromoController),
PesananController: Object.assign(PesananController, PesananController),
KasirController: Object.assign(KasirController, KasirController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers