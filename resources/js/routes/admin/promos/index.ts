import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PromoController::store
 * @see app/Http/Controllers/PromoController.php:117
 * @route '/admin/promos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/promos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PromoController::store
 * @see app/Http/Controllers/PromoController.php:117
 * @route '/admin/promos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromoController::store
 * @see app/Http/Controllers/PromoController.php:117
 * @route '/admin/promos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PromoController::store
 * @see app/Http/Controllers/PromoController.php:117
 * @route '/admin/promos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PromoController::store
 * @see app/Http/Controllers/PromoController.php:117
 * @route '/admin/promos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PromoController::update
 * @see app/Http/Controllers/PromoController.php:127
 * @route '/admin/promos/{promo}'
 */
export const update = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/promos/{promo}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PromoController::update
 * @see app/Http/Controllers/PromoController.php:127
 * @route '/admin/promos/{promo}'
 */
update.url = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_promo' in args) {
            args = { promo: args.id_promo }
        }
    
    if (Array.isArray(args)) {
        args = {
                    promo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        promo: typeof args.promo === 'object'
                ? args.promo.id_promo
                : args.promo,
                }

    return update.definition.url
            .replace('{promo}', parsedArgs.promo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromoController::update
 * @see app/Http/Controllers/PromoController.php:127
 * @route '/admin/promos/{promo}'
 */
update.put = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PromoController::update
 * @see app/Http/Controllers/PromoController.php:127
 * @route '/admin/promos/{promo}'
 */
    const updateForm = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PromoController::update
 * @see app/Http/Controllers/PromoController.php:127
 * @route '/admin/promos/{promo}'
 */
        updateForm.put = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PromoController::destroy
 * @see app/Http/Controllers/PromoController.php:137
 * @route '/admin/promos/{promo}'
 */
export const destroy = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/promos/{promo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PromoController::destroy
 * @see app/Http/Controllers/PromoController.php:137
 * @route '/admin/promos/{promo}'
 */
destroy.url = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_promo' in args) {
            args = { promo: args.id_promo }
        }
    
    if (Array.isArray(args)) {
        args = {
                    promo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        promo: typeof args.promo === 'object'
                ? args.promo.id_promo
                : args.promo,
                }

    return destroy.definition.url
            .replace('{promo}', parsedArgs.promo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PromoController::destroy
 * @see app/Http/Controllers/PromoController.php:137
 * @route '/admin/promos/{promo}'
 */
destroy.delete = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PromoController::destroy
 * @see app/Http/Controllers/PromoController.php:137
 * @route '/admin/promos/{promo}'
 */
    const destroyForm = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PromoController::destroy
 * @see app/Http/Controllers/PromoController.php:137
 * @route '/admin/promos/{promo}'
 */
        destroyForm.delete = (args: { promo: number | { id_promo: number } } | [promo: number | { id_promo: number } ] | number | { id_promo: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const promos = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default promos