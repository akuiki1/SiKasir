import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/pelanggan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PelangganController::index
 * @see app/Http/Controllers/PelangganController.php:20
 * @route '/admin/pelanggan'
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
* @see \App\Http\Controllers\PelangganController::store
 * @see app/Http/Controllers/PelangganController.php:60
 * @route '/admin/pelanggan'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/pelanggan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PelangganController::store
 * @see app/Http/Controllers/PelangganController.php:60
 * @route '/admin/pelanggan'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PelangganController::store
 * @see app/Http/Controllers/PelangganController.php:60
 * @route '/admin/pelanggan'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PelangganController::store
 * @see app/Http/Controllers/PelangganController.php:60
 * @route '/admin/pelanggan'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PelangganController::store
 * @see app/Http/Controllers/PelangganController.php:60
 * @route '/admin/pelanggan'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PelangganController::update
 * @see app/Http/Controllers/PelangganController.php:76
 * @route '/admin/pelanggan/{pelanggan}'
 */
export const update = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/pelanggan/{pelanggan}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PelangganController::update
 * @see app/Http/Controllers/PelangganController.php:76
 * @route '/admin/pelanggan/{pelanggan}'
 */
update.url = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pelanggan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pelanggan' in args) {
            args = { pelanggan: args.id_pelanggan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pelanggan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pelanggan: typeof args.pelanggan === 'object'
                ? args.pelanggan.id_pelanggan
                : args.pelanggan,
                }

    return update.definition.url
            .replace('{pelanggan}', parsedArgs.pelanggan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PelangganController::update
 * @see app/Http/Controllers/PelangganController.php:76
 * @route '/admin/pelanggan/{pelanggan}'
 */
update.put = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PelangganController::update
 * @see app/Http/Controllers/PelangganController.php:76
 * @route '/admin/pelanggan/{pelanggan}'
 */
    const updateForm = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PelangganController::update
 * @see app/Http/Controllers/PelangganController.php:76
 * @route '/admin/pelanggan/{pelanggan}'
 */
        updateForm.put = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PelangganController::destroy
 * @see app/Http/Controllers/PelangganController.php:92
 * @route '/admin/pelanggan/{pelanggan}'
 */
export const destroy = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/pelanggan/{pelanggan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PelangganController::destroy
 * @see app/Http/Controllers/PelangganController.php:92
 * @route '/admin/pelanggan/{pelanggan}'
 */
destroy.url = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pelanggan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pelanggan' in args) {
            args = { pelanggan: args.id_pelanggan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pelanggan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pelanggan: typeof args.pelanggan === 'object'
                ? args.pelanggan.id_pelanggan
                : args.pelanggan,
                }

    return destroy.definition.url
            .replace('{pelanggan}', parsedArgs.pelanggan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PelangganController::destroy
 * @see app/Http/Controllers/PelangganController.php:92
 * @route '/admin/pelanggan/{pelanggan}'
 */
destroy.delete = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PelangganController::destroy
 * @see app/Http/Controllers/PelangganController.php:92
 * @route '/admin/pelanggan/{pelanggan}'
 */
    const destroyForm = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PelangganController::destroy
 * @see app/Http/Controllers/PelangganController.php:92
 * @route '/admin/pelanggan/{pelanggan}'
 */
        destroyForm.delete = (args: { pelanggan: number | { id_pelanggan: number } } | [pelanggan: number | { id_pelanggan: number } ] | number | { id_pelanggan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PelangganController = { index, store, update, destroy }

export default PelangganController