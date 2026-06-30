import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users48860f from './users'
import kategori627be3 from './kategori'
import pelangganDe1373 from './pelanggan'
import products237d17 from './products'
import transactionsBbd80d from './transactions'
import pengeluaransC7d7ce from './pengeluarans'
import stok67e4e1 from './stok'
import produksi22b192 from './produksi'
import laporan from './laporan'
import promosFc23d1 from './promos'
import pesananC38bc3 from './pesanan'
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:36
 * @route '/admin/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserController::users
 * @see app/Http/Controllers/Admin/UserController.php:23
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
export const kategori = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kategori.url(options),
    method: 'get',
})

kategori.definition = {
    methods: ["get","head"],
    url: '/admin/kategori',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
kategori.url = (options?: RouteQueryOptions) => {
    return kategori.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
kategori.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kategori.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
kategori.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kategori.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
    const kategoriForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kategori.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
        kategoriForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kategori.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KategoriController::kategori
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
        kategoriForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kategori.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kategori.form = kategoriForm
/**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
export const pelanggan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pelanggan.url(options),
    method: 'get',
})

pelanggan.definition = {
    methods: ["get","head"],
    url: '/admin/pelanggan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
pelanggan.url = (options?: RouteQueryOptions) => {
    return pelanggan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
pelanggan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pelanggan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
pelanggan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pelanggan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
    const pelangganForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pelanggan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
        pelangganForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pelanggan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PelangganController::pelanggan
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
        pelangganForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pelanggan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pelanggan.form = pelangganForm
/**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
export const products = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})

products.definition = {
    methods: ["get","head"],
    url: '/admin/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
products.url = (options?: RouteQueryOptions) => {
    return products.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
products.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
products.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: products.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
    const productsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: products.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
        productsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: products.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProdukController::products
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
        productsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: products.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    products.form = productsForm
/**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/admin/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
    const transactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: transactions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
        transactionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transactions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransaksiController::transactions
 * @see app/Http/Controllers/TransaksiController.php:26
 * @route '/admin/transactions'
 */
        transactionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transactions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    transactions.form = transactionsForm
/**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
export const pengeluarans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pengeluarans.url(options),
    method: 'get',
})

pengeluarans.definition = {
    methods: ["get","head"],
    url: '/admin/pengeluarans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
pengeluarans.url = (options?: RouteQueryOptions) => {
    return pengeluarans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
pengeluarans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pengeluarans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
pengeluarans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pengeluarans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
    const pengeluaransForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pengeluarans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
        pengeluaransForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pengeluarans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PengeluaranController::pengeluarans
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
        pengeluaransForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pengeluarans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pengeluarans.form = pengeluaransForm
/**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
export const stok = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stok.url(options),
    method: 'get',
})

stok.definition = {
    methods: ["get","head"],
    url: '/admin/stok',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
stok.url = (options?: RouteQueryOptions) => {
    return stok.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
stok.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stok.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
stok.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stok.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
    const stokForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stok.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
        stokForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stok.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StokController::stok
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
        stokForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stok.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stok.form = stokForm
/**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
export const produksi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: produksi.url(options),
    method: 'get',
})

produksi.definition = {
    methods: ["get","head"],
    url: '/admin/produksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
produksi.url = (options?: RouteQueryOptions) => {
    return produksi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
produksi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: produksi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
produksi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: produksi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
    const produksiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: produksi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
        produksiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: produksi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProduksiController::produksi
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
        produksiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: produksi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    produksi.form = produksiForm
/**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
export const promos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promos.url(options),
    method: 'get',
})

promos.definition = {
    methods: ["get","head"],
    url: '/admin/promos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
promos.url = (options?: RouteQueryOptions) => {
    return promos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
promos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: promos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
promos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: promos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
    const promosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: promos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
        promosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: promos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PromoController::promos
 * @see app/Http/Controllers/PromoController.php:20
 * @route '/admin/promos'
 */
        promosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: promos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    promos.form = promosForm
/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
export const pesanan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pesanan.url(options),
    method: 'get',
})

pesanan.definition = {
    methods: ["get","head"],
    url: '/admin/pesanan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
pesanan.url = (options?: RouteQueryOptions) => {
    return pesanan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
pesanan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pesanan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
pesanan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pesanan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
    const pesananForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pesanan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
        pesananForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pesanan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
        pesananForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pesanan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pesanan.form = pesananForm
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
users: Object.assign(users, users48860f),
kategori: Object.assign(kategori, kategori627be3),
pelanggan: Object.assign(pelanggan, pelangganDe1373),
products: Object.assign(products, products237d17),
transactions: Object.assign(transactions, transactionsBbd80d),
pengeluarans: Object.assign(pengeluarans, pengeluaransC7d7ce),
stok: Object.assign(stok, stok67e4e1),
produksi: Object.assign(produksi, produksi22b192),
laporan: Object.assign(laporan, laporan),
promos: Object.assign(promos, promosFc23d1),
pesanan: Object.assign(pesanan, pesananC38bc3),
}

export default admin