import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:21
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
 * @see app/Http/Controllers/KasirController.php:21
 * @route '/kasir/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:21
 * @route '/kasir/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:21
 * @route '/kasir/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:21
 * @route '/kasir/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:21
 * @route '/kasir/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::dashboard
 * @see app/Http/Controllers/KasirController.php:21
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
 * @see app/Http/Controllers/KasirController.php:88
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
 * @see app/Http/Controllers/KasirController.php:88
 * @route '/kasir/transaksi'
 */
transaksi.url = (options?: RouteQueryOptions) => {
    return transaksi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:88
 * @route '/kasir/transaksi'
 */
transaksi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transaksi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:88
 * @route '/kasir/transaksi'
 */
transaksi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transaksi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:88
 * @route '/kasir/transaksi'
 */
    const transaksiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: transaksi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:88
 * @route '/kasir/transaksi'
 */
        transaksiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transaksi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::transaksi
 * @see app/Http/Controllers/KasirController.php:88
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
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:124
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
 * @see app/Http/Controllers/KasirController.php:124
 * @route '/kasir/transaksi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:124
 * @route '/kasir/transaksi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:124
 * @route '/kasir/transaksi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KasirController::store
 * @see app/Http/Controllers/KasirController.php:124
 * @route '/kasir/transaksi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:236
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
 * @see app/Http/Controllers/KasirController.php:236
 * @route '/kasir/riwayat'
 */
riwayat.url = (options?: RouteQueryOptions) => {
    return riwayat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:236
 * @route '/kasir/riwayat'
 */
riwayat.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: riwayat.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:236
 * @route '/kasir/riwayat'
 */
riwayat.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: riwayat.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:236
 * @route '/kasir/riwayat'
 */
    const riwayatForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: riwayat.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:236
 * @route '/kasir/riwayat'
 */
        riwayatForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: riwayat.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::riwayat
 * @see app/Http/Controllers/KasirController.php:236
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
const KasirController = { dashboard, transaksi, store, riwayat }

export default KasirController