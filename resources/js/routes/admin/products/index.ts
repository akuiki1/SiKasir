import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:58
 * @route '/admin/products'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:58
 * @route '/admin/products'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:58
 * @route '/admin/products'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:58
 * @route '/admin/products'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:58
 * @route '/admin/products'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:81
 * @route '/admin/products/{produk}'
 */
export const update = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/products/{produk}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:81
 * @route '/admin/products/{produk}'
 */
update.url = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_produk' in args) {
            args = { produk: args.id_produk }
        }
    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: typeof args.produk === 'object'
                ? args.produk.id_produk
                : args.produk,
                }

    return update.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:81
 * @route '/admin/products/{produk}'
 */
update.put = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:81
 * @route '/admin/products/{produk}'
 */
    const updateForm = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:81
 * @route '/admin/products/{produk}'
 */
        updateForm.put = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:104
 * @route '/admin/products/{produk}'
 */
export const destroy = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/products/{produk}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:104
 * @route '/admin/products/{produk}'
 */
destroy.url = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_produk' in args) {
            args = { produk: args.id_produk }
        }
    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: typeof args.produk === 'object'
                ? args.produk.id_produk
                : args.produk,
                }

    return destroy.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:104
 * @route '/admin/products/{produk}'
 */
destroy.delete = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:104
 * @route '/admin/products/{produk}'
 */
    const destroyForm = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:104
 * @route '/admin/products/{produk}'
 */
        destroyForm.delete = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const products = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default products