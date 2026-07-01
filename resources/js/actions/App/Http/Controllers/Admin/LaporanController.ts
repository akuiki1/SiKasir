import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
export const keuangan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: keuangan.url(options),
    method: 'get',
})

keuangan.definition = {
    methods: ["get","head"],
    url: '/admin/laporan/keuangan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
keuangan.url = (options?: RouteQueryOptions) => {
    return keuangan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
keuangan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: keuangan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
keuangan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: keuangan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
    const keuanganForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: keuangan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
        keuanganForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: keuangan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LaporanController::keuangan
 * @see app/Http/Controllers/Admin/LaporanController.php:31
 * @route '/admin/laporan/keuangan'
 */
        keuanganForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: keuangan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    keuangan.form = keuanganForm
/**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
export const penjualan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penjualan.url(options),
    method: 'get',
})

penjualan.definition = {
    methods: ["get","head"],
    url: '/admin/laporan/penjualan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
penjualan.url = (options?: RouteQueryOptions) => {
    return penjualan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
penjualan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penjualan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
penjualan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: penjualan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
    const penjualanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: penjualan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
        penjualanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: penjualan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LaporanController::penjualan
 * @see app/Http/Controllers/Admin/LaporanController.php:285
 * @route '/admin/laporan/penjualan'
 */
        penjualanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: penjualan.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    penjualan.form = penjualanForm
/**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
export const inventaris = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inventaris.url(options),
    method: 'get',
})

inventaris.definition = {
    methods: ["get","head"],
    url: '/admin/laporan/inventaris',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
inventaris.url = (options?: RouteQueryOptions) => {
    return inventaris.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
inventaris.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inventaris.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
inventaris.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: inventaris.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
    const inventarisForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: inventaris.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
        inventarisForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: inventaris.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LaporanController::inventaris
 * @see app/Http/Controllers/Admin/LaporanController.php:429
 * @route '/admin/laporan/inventaris'
 */
        inventarisForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: inventaris.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    inventaris.form = inventarisForm
/**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
 */
export const pelanggan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pelanggan.url(options),
    method: 'get',
})

pelanggan.definition = {
    methods: ["get","head"],
    url: '/admin/laporan/pelanggan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
 */
pelanggan.url = (options?: RouteQueryOptions) => {
    return pelanggan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
 */
pelanggan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pelanggan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
 */
pelanggan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pelanggan.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
 */
    const pelangganForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pelanggan.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
 */
        pelangganForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pelanggan.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LaporanController::pelanggan
 * @see app/Http/Controllers/Admin/LaporanController.php:467
 * @route '/admin/laporan/pelanggan'
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
const LaporanController = { keuangan, penjualan, inventaris, pelanggan }

export default LaporanController