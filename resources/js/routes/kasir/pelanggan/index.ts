import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
export const cari = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cari.url(options),
    method: 'get',
})

cari.definition = {
    methods: ["get","head"],
    url: '/kasir/pelanggan/cari',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
cari.url = (options?: RouteQueryOptions) => {
    return cari.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
cari.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cari.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
cari.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cari.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
    const cariForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cari.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
        cariForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cari.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::cari
 * @see app/Http/Controllers/KasirController.php:298
 * @route '/kasir/pelanggan/cari'
 */
        cariForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cari.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cari.form = cariForm
const pelanggan = {
    cari: Object.assign(cari, cari),
}

export default pelanggan