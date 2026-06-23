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
const PesananPublikController = { store }

export default PesananPublikController