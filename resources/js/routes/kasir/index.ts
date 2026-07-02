import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import transaksi6b18b1 from './transaksi'
import pelanggan from './pelanggan'
import riwayat8b6480 from './riwayat'
import pesananC38bc3 from './pesanan'
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
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
export const pesanan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pesanan.url(options),
    method: 'get',
})

pesanan.definition = {
    methods: ["get","head"],
    url: '/kasir/pesanan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
pesanan.url = (options?: RouteQueryOptions) => {
    return pesanan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
pesanan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pesanan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
pesanan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pesanan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
    const pesananForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pesanan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
        pesananForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pesanan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesananController::pesanan
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
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
const kasir = {
    dashboard: Object.assign(dashboard, dashboard),
transaksi: Object.assign(transaksi, transaksi6b18b1),
pelanggan: Object.assign(pelanggan, pelanggan),
riwayat: Object.assign(riwayat, riwayat8b6480),
pesanan: Object.assign(pesanan, pesananC38bc3),
}

export default kasir