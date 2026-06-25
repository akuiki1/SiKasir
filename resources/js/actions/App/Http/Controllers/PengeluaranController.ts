import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/pengeluarans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PengeluaranController::index
 * @see app/Http/Controllers/PengeluaranController.php:20
 * @route '/admin/pengeluarans'
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
* @see \App\Http\Controllers\PengeluaranController::store
 * @see app/Http/Controllers/PengeluaranController.php:68
 * @route '/admin/pengeluarans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/pengeluarans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PengeluaranController::store
 * @see app/Http/Controllers/PengeluaranController.php:68
 * @route '/admin/pengeluarans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengeluaranController::store
 * @see app/Http/Controllers/PengeluaranController.php:68
 * @route '/admin/pengeluarans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PengeluaranController::store
 * @see app/Http/Controllers/PengeluaranController.php:68
 * @route '/admin/pengeluarans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PengeluaranController::store
 * @see app/Http/Controllers/PengeluaranController.php:68
 * @route '/admin/pengeluarans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PengeluaranController::update
 * @see app/Http/Controllers/PengeluaranController.php:85
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
export const update = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/pengeluarans/{pengeluaran}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PengeluaranController::update
 * @see app/Http/Controllers/PengeluaranController.php:85
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
update.url = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pengeluaran: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pengeluaran' in args) {
            args = { pengeluaran: args.id_pengeluaran }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pengeluaran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pengeluaran: typeof args.pengeluaran === 'object'
                ? args.pengeluaran.id_pengeluaran
                : args.pengeluaran,
                }

    return update.definition.url
            .replace('{pengeluaran}', parsedArgs.pengeluaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengeluaranController::update
 * @see app/Http/Controllers/PengeluaranController.php:85
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
update.put = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PengeluaranController::update
 * @see app/Http/Controllers/PengeluaranController.php:85
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
    const updateForm = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PengeluaranController::update
 * @see app/Http/Controllers/PengeluaranController.php:85
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
        updateForm.put = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PengeluaranController::destroy
 * @see app/Http/Controllers/PengeluaranController.php:102
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
export const destroy = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/pengeluarans/{pengeluaran}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PengeluaranController::destroy
 * @see app/Http/Controllers/PengeluaranController.php:102
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
destroy.url = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pengeluaran: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pengeluaran' in args) {
            args = { pengeluaran: args.id_pengeluaran }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pengeluaran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pengeluaran: typeof args.pengeluaran === 'object'
                ? args.pengeluaran.id_pengeluaran
                : args.pengeluaran,
                }

    return destroy.definition.url
            .replace('{pengeluaran}', parsedArgs.pengeluaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengeluaranController::destroy
 * @see app/Http/Controllers/PengeluaranController.php:102
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
destroy.delete = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PengeluaranController::destroy
 * @see app/Http/Controllers/PengeluaranController.php:102
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
    const destroyForm = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PengeluaranController::destroy
 * @see app/Http/Controllers/PengeluaranController.php:102
 * @route '/admin/pengeluarans/{pengeluaran}'
 */
        destroyForm.delete = (args: { pengeluaran: number | { id_pengeluaran: number } } | [pengeluaran: number | { id_pengeluaran: number } ] | number | { id_pengeluaran: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PengeluaranController = { index, store, update, destroy }

export default PengeluaranController