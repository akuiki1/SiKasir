import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:23
 * @route '/admin/products'
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
* @see \App\Http\Controllers\ProdukController::generateAllBarcodes
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
export const generateAllBarcodes = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAllBarcodes.url(options),
    method: 'post',
})

generateAllBarcodes.definition = {
    methods: ["post"],
    url: '/admin/products/generate-all-barcodes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::generateAllBarcodes
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
generateAllBarcodes.url = (options?: RouteQueryOptions) => {
    return generateAllBarcodes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::generateAllBarcodes
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
generateAllBarcodes.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAllBarcodes.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProdukController::generateAllBarcodes
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
    const generateAllBarcodesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateAllBarcodes.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::generateAllBarcodes
 * @see app/Http/Controllers/ProdukController.php:301
 * @route '/admin/products/generate-all-barcodes'
 */
        generateAllBarcodesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateAllBarcodes.url(options),
            method: 'post',
        })
    
    generateAllBarcodes.form = generateAllBarcodesForm
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
* @see \App\Http\Controllers\ProdukController::hapusPermanen
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
export const hapusPermanen = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: hapusPermanen.url(args, options),
    method: 'delete',
})

hapusPermanen.definition = {
    methods: ["delete"],
    url: '/admin/products/{produk}/force',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProdukController::hapusPermanen
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
hapusPermanen.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return hapusPermanen.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::hapusPermanen
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
hapusPermanen.delete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: hapusPermanen.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProdukController::hapusPermanen
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
    const hapusPermanenForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: hapusPermanen.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::hapusPermanen
 * @see app/Http/Controllers/ProdukController.php:390
 * @route '/admin/products/{produk}/force'
 */
        hapusPermanenForm.delete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: hapusPermanen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    hapusPermanen.form = hapusPermanenForm
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
const ProdukController = { index, store, generateAllBarcodes, restore, hapusPermanen, update, destroy }

export default ProdukController