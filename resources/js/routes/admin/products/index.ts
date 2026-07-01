import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:137
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
 * @see app/Http/Controllers/ProdukController.php:137
 * @route '/admin/products'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:137
 * @route '/admin/products'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:137
 * @route '/admin/products'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:137
 * @route '/admin/products'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProdukController::generateAll
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
export const generateAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAll.url(options),
    method: 'post',
})

generateAll.definition = {
    methods: ["post"],
    url: '/admin/products/generate-all-barcodes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::generateAll
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
generateAll.url = (options?: RouteQueryOptions) => {
    return generateAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::generateAll
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
generateAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAll.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProdukController::generateAll
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
    const generateAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateAll.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::generateAll
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
        generateAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateAll.url(options),
            method: 'post',
        })
    
    generateAll.form = generateAllForm
/**
* @see \App\Http\Controllers\ProdukController::restore
 * @see app/Http/Controllers/ProdukController.php:365
 * @route '/admin/products/{produk}/restore'
 */
export const restore = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/products/{produk}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::restore
 * @see app/Http/Controllers/ProdukController.php:365
 * @route '/admin/products/{produk}/restore'
 */
restore.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: args.produk,
                }

    return restore.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::restore
 * @see app/Http/Controllers/ProdukController.php:365
 * @route '/admin/products/{produk}/restore'
 */
restore.post = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProdukController::restore
 * @see app/Http/Controllers/ProdukController.php:365
 * @route '/admin/products/{produk}/restore'
 */
    const restoreForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::restore
 * @see app/Http/Controllers/ProdukController.php:365
 * @route '/admin/products/{produk}/restore'
 */
        restoreForm.post = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restore.url(args, options),
            method: 'post',
        })
    
    restore.form = restoreForm
/**
* @see \App\Http\Controllers\ProdukController::forceDelete
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
export const forceDelete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: forceDelete.url(args, options),
    method: 'delete',
})

forceDelete.definition = {
    methods: ["delete"],
    url: '/admin/products/{produk}/force',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProdukController::forceDelete
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
forceDelete.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: args.produk,
                }

    return forceDelete.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::forceDelete
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
forceDelete.delete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: forceDelete.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProdukController::forceDelete
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
    const forceDeleteForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: forceDelete.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::forceDelete
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
        forceDeleteForm.delete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: forceDelete.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    forceDelete.form = forceDeleteForm
/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:220
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
 * @see app/Http/Controllers/ProdukController.php:220
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
 * @see app/Http/Controllers/ProdukController.php:220
 * @route '/admin/products/{produk}'
 */
update.put = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:220
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
 * @see app/Http/Controllers/ProdukController.php:220
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
 * @see app/Http/Controllers/ProdukController.php:355
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
 * @see app/Http/Controllers/ProdukController.php:355
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
 * @see app/Http/Controllers/ProdukController.php:355
 * @route '/admin/products/{produk}'
 */
destroy.delete = (args: { produk: number | { id_produk: number } } | [produk: number | { id_produk: number } ] | number | { id_produk: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:355
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
 * @see app/Http/Controllers/ProdukController.php:355
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
generateAll: Object.assign(generateAll, generateAll),
restore: Object.assign(restore, restore),
forceDelete: Object.assign(forceDelete, forceDelete),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default products