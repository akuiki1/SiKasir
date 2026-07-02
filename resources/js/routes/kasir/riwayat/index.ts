import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
export const cetak = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cetak.url(options),
    method: 'get',
})

cetak.definition = {
    methods: ["get","head"],
    url: '/kasir/riwayat/cetak',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
cetak.url = (options?: RouteQueryOptions) => {
    return cetak.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
cetak.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cetak.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
cetak.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cetak.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
    const cetakForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cetak.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
        cetakForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cetak.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirController::cetak
 * @see app/Http/Controllers/KasirController.php:678
 * @route '/kasir/riwayat/cetak'
 */
        cetakForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cetak.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cetak.form = cetakForm
const riwayat = {
    cetak: Object.assign(cetak, cetak),
}

export default riwayat