import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TransaksiController::store
 * @see app/Http/Controllers/TransaksiController.php:100
 * @route '/admin/transactions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransaksiController::store
 * @see app/Http/Controllers/TransaksiController.php:100
 * @route '/admin/transactions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransaksiController::store
 * @see app/Http/Controllers/TransaksiController.php:100
 * @route '/admin/transactions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransaksiController::store
 * @see app/Http/Controllers/TransaksiController.php:100
 * @route '/admin/transactions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransaksiController::store
 * @see app/Http/Controllers/TransaksiController.php:100
 * @route '/admin/transactions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TransaksiController::update
 * @see app/Http/Controllers/TransaksiController.php:122
 * @route '/admin/transactions/{transaksi}'
 */
export const update = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/transactions/{transaksi}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TransaksiController::update
 * @see app/Http/Controllers/TransaksiController.php:122
 * @route '/admin/transactions/{transaksi}'
 */
update.url = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaksi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_transaksi' in args) {
            args = { transaksi: args.id_transaksi }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaksi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaksi: typeof args.transaksi === 'object'
                ? args.transaksi.id_transaksi
                : args.transaksi,
                }

    return update.definition.url
            .replace('{transaksi}', parsedArgs.transaksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransaksiController::update
 * @see app/Http/Controllers/TransaksiController.php:122
 * @route '/admin/transactions/{transaksi}'
 */
update.put = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TransaksiController::update
 * @see app/Http/Controllers/TransaksiController.php:122
 * @route '/admin/transactions/{transaksi}'
 */
    const updateForm = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransaksiController::update
 * @see app/Http/Controllers/TransaksiController.php:122
 * @route '/admin/transactions/{transaksi}'
 */
        updateForm.put = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TransaksiController::destroy
 * @see app/Http/Controllers/TransaksiController.php:146
 * @route '/admin/transactions/{transaksi}'
 */
export const destroy = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/transactions/{transaksi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TransaksiController::destroy
 * @see app/Http/Controllers/TransaksiController.php:146
 * @route '/admin/transactions/{transaksi}'
 */
destroy.url = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaksi: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_transaksi' in args) {
            args = { transaksi: args.id_transaksi }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaksi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaksi: typeof args.transaksi === 'object'
                ? args.transaksi.id_transaksi
                : args.transaksi,
                }

    return destroy.definition.url
            .replace('{transaksi}', parsedArgs.transaksi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransaksiController::destroy
 * @see app/Http/Controllers/TransaksiController.php:146
 * @route '/admin/transactions/{transaksi}'
 */
destroy.delete = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TransaksiController::destroy
 * @see app/Http/Controllers/TransaksiController.php:146
 * @route '/admin/transactions/{transaksi}'
 */
    const destroyForm = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransaksiController::destroy
 * @see app/Http/Controllers/TransaksiController.php:146
 * @route '/admin/transactions/{transaksi}'
 */
        destroyForm.delete = (args: { transaksi: number | { id_transaksi: number } } | [transaksi: number | { id_transaksi: number } ] | number | { id_transaksi: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const transactions = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default transactions