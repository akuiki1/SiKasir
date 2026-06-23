import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesananPublikController::store
 * @see app/Http/Controllers/PesananPublikController.php:29
 * @route '/pesan'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pesan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananPublikController::store
 * @see app/Http/Controllers/PesananPublikController.php:29
 * @route '/pesan'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananPublikController::store
 * @see app/Http/Controllers/PesananPublikController.php:29
 * @route '/pesan'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananPublikController::store
 * @see app/Http/Controllers/PesananPublikController.php:29
 * @route '/pesan'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananPublikController::store
 * @see app/Http/Controllers/PesananPublikController.php:29
 * @route '/pesan'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PesananPublikController::lacak
 * @see app/Http/Controllers/PesananPublikController.php:74
 * @route '/lacak-pesanan'
 */
export const lacak = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lacak.url(options),
    method: 'post',
})

lacak.definition = {
    methods: ["post"],
    url: '/lacak-pesanan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananPublikController::lacak
 * @see app/Http/Controllers/PesananPublikController.php:74
 * @route '/lacak-pesanan'
 */
lacak.url = (options?: RouteQueryOptions) => {
    return lacak.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananPublikController::lacak
 * @see app/Http/Controllers/PesananPublikController.php:74
 * @route '/lacak-pesanan'
 */
lacak.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lacak.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananPublikController::lacak
 * @see app/Http/Controllers/PesananPublikController.php:74
 * @route '/lacak-pesanan'
 */
    const lacakForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: lacak.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananPublikController::lacak
 * @see app/Http/Controllers/PesananPublikController.php:74
 * @route '/lacak-pesanan'
 */
        lacakForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: lacak.url(options),
            method: 'post',
        })
    
    lacak.form = lacakForm
const PesananPublikController = { store, lacak }

export default PesananPublikController