import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/produksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProduksiController::index
 * @see app/Http/Controllers/ProduksiController.php:25
 * @route '/admin/produksi'
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
* @see \App\Http\Controllers\ProduksiController::store
 * @see app/Http/Controllers/ProduksiController.php:73
 * @route '/admin/produksi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/produksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProduksiController::store
 * @see app/Http/Controllers/ProduksiController.php:73
 * @route '/admin/produksi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProduksiController::store
 * @see app/Http/Controllers/ProduksiController.php:73
 * @route '/admin/produksi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProduksiController::store
 * @see app/Http/Controllers/ProduksiController.php:73
 * @route '/admin/produksi'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProduksiController::store
 * @see app/Http/Controllers/ProduksiController.php:73
 * @route '/admin/produksi'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProduksiController::destroy
 * @see app/Http/Controllers/ProduksiController.php:157
 * @route '/admin/produksi/{produksi}'
 */
export const destroy = (args: { produksi: number | { id_produksi: number } } | [produksi: number | { id_produksi: number } ] | number | { id_produksi: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/produksi/{produksi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProduksiController::destroy
 * @see app/Http/Controllers/ProduksiController.php:157
 * @route '/admin/produksi/{produksi}'
 */
destroy.url = (args: { produksi: number | { id_produksi: number } } | [produksi: number | { id_produksi: number } ] | number | { id_produksi: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produksi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_produksi' in args) {
            args = { produksi: args.id_produksi }
        }
    
    if (Array.isArray(args)) {
        args = {
                    produksi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produksi: typeof args.produksi === 'object'
                ? args.produksi.id_produksi
                : args.produksi,
                }

    return destroy.definition.url
            .replace('{produksi}', parsedArgs.produksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProduksiController::destroy
 * @see app/Http/Controllers/ProduksiController.php:157
 * @route '/admin/produksi/{produksi}'
 */
destroy.delete = (args: { produksi: number | { id_produksi: number } } | [produksi: number | { id_produksi: number } ] | number | { id_produksi: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProduksiController::destroy
 * @see app/Http/Controllers/ProduksiController.php:157
 * @route '/admin/produksi/{produksi}'
 */
    const destroyForm = (args: { produksi: number | { id_produksi: number } } | [produksi: number | { id_produksi: number } ] | number | { id_produksi: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProduksiController::destroy
 * @see app/Http/Controllers/ProduksiController.php:157
 * @route '/admin/produksi/{produksi}'
 */
        destroyForm.delete = (args: { produksi: number | { id_produksi: number } } | [produksi: number | { id_produksi: number } ] | number | { id_produksi: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProduksiController = { index, store, destroy }

export default ProduksiController