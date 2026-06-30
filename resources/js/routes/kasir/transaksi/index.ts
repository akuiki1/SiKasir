import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const transaksi = {
    store: Object.assign(store, store),
}

export default transaksi