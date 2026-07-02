import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/kasir/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:37
 * @route '/kasir/dashboard'
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
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
export const transaksi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transaksi.url(options),
    method: 'get',
})

transaksi.definition = {
    methods: ["get","head"],
    url: '/kasir/transaksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
transaksi.url = (options?: RouteQueryOptions) => {
    return transaksi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
transaksi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transaksi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
transaksi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transaksi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
    const transaksiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: transaksi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
        transaksiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transaksi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:224
 * @route '/kasir/transaksi'
 */
        transaksiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transaksi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    transaksi.form = transaksiForm
/**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
export const cariPelanggan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cariPelanggan.url(options),
    method: 'get',
})

cariPelanggan.definition = {
    methods: ["get","head"],
    url: '/kasir/pelanggan/cari',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
cariPelanggan.url = (options?: RouteQueryOptions) => {
    return cariPelanggan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
cariPelanggan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cariPelanggan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
cariPelanggan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cariPelanggan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
    const cariPelangganForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cariPelanggan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
        cariPelangganForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cariPelanggan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::cariPelanggan
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
        cariPelangganForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cariPelanggan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cariPelanggan.form = cariPelangganForm
/**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:347
 * @route '/kasir/transaksi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kasir/transaksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:347
 * @route '/kasir/transaksi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:347
 * @route '/kasir/transaksi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:347
 * @route '/kasir/transaksi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:347
 * @route '/kasir/transaksi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
export const riwayat = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayat.url(options),
    method: 'get',
})

riwayat.definition = {
    methods: ["get","head"],
    url: '/kasir/riwayat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
riwayat.url = (options?: RouteQueryOptions) => {
    return riwayat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
riwayat.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayat.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
riwayat.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riwayat.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
    const riwayatForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riwayat.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
        riwayatForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riwayat.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:636
 * @route '/kasir/riwayat'
 */
        riwayatForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riwayat.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    riwayat.form = riwayatForm
/**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
export const riwayatCetak = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayatCetak.url(options),
    method: 'get',
})

riwayatCetak.definition = {
    methods: ["get","head"],
    url: '/kasir/riwayat/cetak',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
riwayatCetak.url = (options?: RouteQueryOptions) => {
    return riwayatCetak.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
riwayatCetak.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayatCetak.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
riwayatCetak.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riwayatCetak.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
    const riwayatCetakForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riwayatCetak.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
        riwayatCetakForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riwayatCetak.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::riwayatCetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
        riwayatCetakForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riwayatCetak.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    riwayatCetak.form = riwayatCetakForm
const KasirController = { dashboard, transaksi, cariPelanggan, store, riwayat, riwayatCetak }

export default KasirController