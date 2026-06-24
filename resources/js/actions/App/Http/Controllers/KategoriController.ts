import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kategori',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KategoriController::index
 * @see app/Http/Controllers/KategoriController.php:20
 * @route '/admin/kategori'
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
* @see \App\Http\Controllers\KategoriController::store
 * @see app/Http/Controllers/KategoriController.php:47
 * @route '/admin/kategori'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/kategori',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KategoriController::store
 * @see app/Http/Controllers/KategoriController.php:47
 * @route '/admin/kategori'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KategoriController::store
 * @see app/Http/Controllers/KategoriController.php:47
 * @route '/admin/kategori'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KategoriController::store
 * @see app/Http/Controllers/KategoriController.php:47
 * @route '/admin/kategori'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KategoriController::store
 * @see app/Http/Controllers/KategoriController.php:47
 * @route '/admin/kategori'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\KategoriController::update
 * @see app/Http/Controllers/KategoriController.php:61
 * @route '/admin/kategori/{kategori}'
 */
export const update = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/kategori/{kategori}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\KategoriController::update
 * @see app/Http/Controllers/KategoriController.php:61
 * @route '/admin/kategori/{kategori}'
 */
update.url = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kategori: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_kategori' in args) {
            args = { kategori: args.id_kategori }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kategori: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kategori: typeof args.kategori === 'object'
                ? args.kategori.id_kategori
                : args.kategori,
                }

    return update.definition.url
            .replace('{kategori}', parsedArgs.kategori.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KategoriController::update
 * @see app/Http/Controllers/KategoriController.php:61
 * @route '/admin/kategori/{kategori}'
 */
update.put = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\KategoriController::update
 * @see app/Http/Controllers/KategoriController.php:61
 * @route '/admin/kategori/{kategori}'
 */
    const updateForm = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KategoriController::update
 * @see app/Http/Controllers/KategoriController.php:61
 * @route '/admin/kategori/{kategori}'
 */
        updateForm.put = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KategoriController::destroy
 * @see app/Http/Controllers/KategoriController.php:75
 * @route '/admin/kategori/{kategori}'
 */
export const destroy = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/kategori/{kategori}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KategoriController::destroy
 * @see app/Http/Controllers/KategoriController.php:75
 * @route '/admin/kategori/{kategori}'
 */
destroy.url = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kategori: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_kategori' in args) {
            args = { kategori: args.id_kategori }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kategori: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kategori: typeof args.kategori === 'object'
                ? args.kategori.id_kategori
                : args.kategori,
                }

    return destroy.definition.url
            .replace('{kategori}', parsedArgs.kategori.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KategoriController::destroy
 * @see app/Http/Controllers/KategoriController.php:75
 * @route '/admin/kategori/{kategori}'
 */
destroy.delete = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\KategoriController::destroy
 * @see app/Http/Controllers/KategoriController.php:75
 * @route '/admin/kategori/{kategori}'
 */
    const destroyForm = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KategoriController::destroy
 * @see app/Http/Controllers/KategoriController.php:75
 * @route '/admin/kategori/{kategori}'
 */
        destroyForm.delete = (args: { kategori: number | { id_kategori: number } } | [kategori: number | { id_kategori: number } ] | number | { id_kategori: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const KategoriController = { index, store, update, destroy }

export default KategoriController