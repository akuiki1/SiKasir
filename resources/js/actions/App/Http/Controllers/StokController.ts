import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/stok',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StokController::index
 * @see app/Http/Controllers/StokController.php:47
 * @route '/admin/stok'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\StokController::masuk
 * @see app/Http/Controllers/StokController.php:147
 * @route '/admin/stok/masuk'
 */
export const masuk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: masuk.url(options),
    method: 'post',
})

masuk.definition = {
    methods: ["post"],
    url: '/admin/stok/masuk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StokController::masuk
 * @see app/Http/Controllers/StokController.php:147
 * @route '/admin/stok/masuk'
 */
masuk.url = (options?: RouteQueryOptions) => {
    return masuk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::masuk
 * @see app/Http/Controllers/StokController.php:147
 * @route '/admin/stok/masuk'
 */
masuk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: masuk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StokController::masuk
 * @see app/Http/Controllers/StokController.php:147
 * @route '/admin/stok/masuk'
 */
    const masukForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: masuk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StokController::masuk
 * @see app/Http/Controllers/StokController.php:147
 * @route '/admin/stok/masuk'
 */
        masukForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: masuk.url(options),
            method: 'post',
        })
    
    masuk.form = masukForm
/**
* @see \App\Http\Controllers\StokController::keluar
 * @see app/Http/Controllers/StokController.php:180
 * @route '/admin/stok/keluar'
 */
export const keluar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: keluar.url(options),
    method: 'post',
})

keluar.definition = {
    methods: ["post"],
    url: '/admin/stok/keluar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StokController::keluar
 * @see app/Http/Controllers/StokController.php:180
 * @route '/admin/stok/keluar'
 */
keluar.url = (options?: RouteQueryOptions) => {
    return keluar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::keluar
 * @see app/Http/Controllers/StokController.php:180
 * @route '/admin/stok/keluar'
 */
keluar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: keluar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StokController::keluar
 * @see app/Http/Controllers/StokController.php:180
 * @route '/admin/stok/keluar'
 */
    const keluarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: keluar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StokController::keluar
 * @see app/Http/Controllers/StokController.php:180
 * @route '/admin/stok/keluar'
 */
        keluarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: keluar.url(options),
            method: 'post',
        })
    
    keluar.form = keluarForm
/**
* @see \App\Http\Controllers\StokController::penyesuaian
 * @see app/Http/Controllers/StokController.php:220
 * @route '/admin/stok/penyesuaian'
 */
export const penyesuaian = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: penyesuaian.url(options),
    method: 'post',
})

penyesuaian.definition = {
    methods: ["post"],
    url: '/admin/stok/penyesuaian',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StokController::penyesuaian
 * @see app/Http/Controllers/StokController.php:220
 * @route '/admin/stok/penyesuaian'
 */
penyesuaian.url = (options?: RouteQueryOptions) => {
    return penyesuaian.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StokController::penyesuaian
 * @see app/Http/Controllers/StokController.php:220
 * @route '/admin/stok/penyesuaian'
 */
penyesuaian.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: penyesuaian.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StokController::penyesuaian
 * @see app/Http/Controllers/StokController.php:220
 * @route '/admin/stok/penyesuaian'
 */
    const penyesuaianForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: penyesuaian.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StokController::penyesuaian
 * @see app/Http/Controllers/StokController.php:220
 * @route '/admin/stok/penyesuaian'
 */
        penyesuaianForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: penyesuaian.url(options),
            method: 'post',
        })
    
    penyesuaian.form = penyesuaianForm
const StokController = { index, masuk, keluar, penyesuaian }

export default StokController