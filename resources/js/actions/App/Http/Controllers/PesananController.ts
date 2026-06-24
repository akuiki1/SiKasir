import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
const indexc110138e43b52377056d9732553d9cc6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexc110138e43b52377056d9732553d9cc6.url(options),
    method: 'get',
})

indexc110138e43b52377056d9732553d9cc6.definition = {
    methods: ["get","head"],
    url: '/admin/pesanan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
indexc110138e43b52377056d9732553d9cc6.url = (options?: RouteQueryOptions) => {
    return indexc110138e43b52377056d9732553d9cc6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
indexc110138e43b52377056d9732553d9cc6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexc110138e43b52377056d9732553d9cc6.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
indexc110138e43b52377056d9732553d9cc6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexc110138e43b52377056d9732553d9cc6.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
    const indexc110138e43b52377056d9732553d9cc6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexc110138e43b52377056d9732553d9cc6.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
        indexc110138e43b52377056d9732553d9cc6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexc110138e43b52377056d9732553d9cc6.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/admin/pesanan'
 */
        indexc110138e43b52377056d9732553d9cc6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexc110138e43b52377056d9732553d9cc6.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexc110138e43b52377056d9732553d9cc6.form = indexc110138e43b52377056d9732553d9cc6Form
    /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
const indexd3c0d00c3d86294fb0ce3d68d24ed52f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd3c0d00c3d86294fb0ce3d68d24ed52f.url(options),
    method: 'get',
})

indexd3c0d00c3d86294fb0ce3d68d24ed52f.definition = {
    methods: ["get","head"],
    url: '/kasir/pesanan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
indexd3c0d00c3d86294fb0ce3d68d24ed52f.url = (options?: RouteQueryOptions) => {
    return indexd3c0d00c3d86294fb0ce3d68d24ed52f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
indexd3c0d00c3d86294fb0ce3d68d24ed52f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd3c0d00c3d86294fb0ce3d68d24ed52f.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
indexd3c0d00c3d86294fb0ce3d68d24ed52f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexd3c0d00c3d86294fb0ce3d68d24ed52f.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
    const indexd3c0d00c3d86294fb0ce3d68d24ed52fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexd3c0d00c3d86294fb0ce3d68d24ed52f.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
        indexd3c0d00c3d86294fb0ce3d68d24ed52fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexd3c0d00c3d86294fb0ce3d68d24ed52f.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PesananController::index
 * @see app/Http/Controllers/PesananController.php:29
 * @route '/kasir/pesanan'
 */
        indexd3c0d00c3d86294fb0ce3d68d24ed52fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexd3c0d00c3d86294fb0ce3d68d24ed52f.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexd3c0d00c3d86294fb0ce3d68d24ed52f.form = indexd3c0d00c3d86294fb0ce3d68d24ed52fForm

/**
* Multiple routes resolve to \App\Http\Controllers\PesananController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/admin/pesanan': indexc110138e43b52377056d9732553d9cc6,
    '/kasir/pesanan': indexd3c0d00c3d86294fb0ce3d68d24ed52f,
}

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
const siap4ff679c547ec378211ae3b321c078e29 = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siap4ff679c547ec378211ae3b321c078e29.url(args, options),
    method: 'post',
})

siap4ff679c547ec378211ae3b321c078e29.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/siap',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
siap4ff679c547ec378211ae3b321c078e29.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return siap4ff679c547ec378211ae3b321c078e29.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
siap4ff679c547ec378211ae3b321c078e29.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siap4ff679c547ec378211ae3b321c078e29.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
    const siap4ff679c547ec378211ae3b321c078e29Form = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: siap4ff679c547ec378211ae3b321c078e29.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
        siap4ff679c547ec378211ae3b321c078e29Form.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: siap4ff679c547ec378211ae3b321c078e29.url(args, options),
            method: 'post',
        })
    
    siap4ff679c547ec378211ae3b321c078e29.form = siap4ff679c547ec378211ae3b321c078e29Form
    /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
const siapd5f934b40369b7044325673f539ea489 = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siapd5f934b40369b7044325673f539ea489.url(args, options),
    method: 'post',
})

siapd5f934b40369b7044325673f539ea489.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/siap',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
siapd5f934b40369b7044325673f539ea489.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return siapd5f934b40369b7044325673f539ea489.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
siapd5f934b40369b7044325673f539ea489.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siapd5f934b40369b7044325673f539ea489.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
    const siapd5f934b40369b7044325673f539ea489Form = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: siapd5f934b40369b7044325673f539ea489.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
        siapd5f934b40369b7044325673f539ea489Form.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: siapd5f934b40369b7044325673f539ea489.url(args, options),
            method: 'post',
        })
    
    siapd5f934b40369b7044325673f539ea489.form = siapd5f934b40369b7044325673f539ea489Form

/**
* Multiple routes resolve to \App\Http\Controllers\PesananController::siap, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `siap['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const siap = {
    '/admin/pesanan/{pesanan}/siap': siap4ff679c547ec378211ae3b321c078e29,
    '/kasir/pesanan/{pesanan}/siap': siapd5f934b40369b7044325673f539ea489,
}

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
const edit836c8ab6cf3dc516862b101055231c6a = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: edit836c8ab6cf3dc516862b101055231c6a.url(args, options),
    method: 'post',
})

edit836c8ab6cf3dc516862b101055231c6a.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/edit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
edit836c8ab6cf3dc516862b101055231c6a.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return edit836c8ab6cf3dc516862b101055231c6a.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
edit836c8ab6cf3dc516862b101055231c6a.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: edit836c8ab6cf3dc516862b101055231c6a.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
    const edit836c8ab6cf3dc516862b101055231c6aForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: edit836c8ab6cf3dc516862b101055231c6a.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
        edit836c8ab6cf3dc516862b101055231c6aForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: edit836c8ab6cf3dc516862b101055231c6a.url(args, options),
            method: 'post',
        })
    
    edit836c8ab6cf3dc516862b101055231c6a.form = edit836c8ab6cf3dc516862b101055231c6aForm
    /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/kasir/pesanan/{pesanan}/edit'
 */
const editedd1687a170c34dec9b7af3782904754 = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: editedd1687a170c34dec9b7af3782904754.url(args, options),
    method: 'post',
})

editedd1687a170c34dec9b7af3782904754.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/edit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/kasir/pesanan/{pesanan}/edit'
 */
editedd1687a170c34dec9b7af3782904754.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return editedd1687a170c34dec9b7af3782904754.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/kasir/pesanan/{pesanan}/edit'
 */
editedd1687a170c34dec9b7af3782904754.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: editedd1687a170c34dec9b7af3782904754.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/kasir/pesanan/{pesanan}/edit'
 */
    const editedd1687a170c34dec9b7af3782904754Form = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: editedd1687a170c34dec9b7af3782904754.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/kasir/pesanan/{pesanan}/edit'
 */
        editedd1687a170c34dec9b7af3782904754Form.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: editedd1687a170c34dec9b7af3782904754.url(args, options),
            method: 'post',
        })
    
    editedd1687a170c34dec9b7af3782904754.form = editedd1687a170c34dec9b7af3782904754Form

/**
* Multiple routes resolve to \App\Http\Controllers\PesananController::edit, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `edit['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const edit = {
    '/admin/pesanan/{pesanan}/edit': edit836c8ab6cf3dc516862b101055231c6a,
    '/kasir/pesanan/{pesanan}/edit': editedd1687a170c34dec9b7af3782904754,
}

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
const proses47a996573749e6c1251a26c002a7623c = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses47a996573749e6c1251a26c002a7623c.url(args, options),
    method: 'post',
})

proses47a996573749e6c1251a26c002a7623c.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/proses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
proses47a996573749e6c1251a26c002a7623c.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return proses47a996573749e6c1251a26c002a7623c.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
proses47a996573749e6c1251a26c002a7623c.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses47a996573749e6c1251a26c002a7623c.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
    const proses47a996573749e6c1251a26c002a7623cForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: proses47a996573749e6c1251a26c002a7623c.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
        proses47a996573749e6c1251a26c002a7623cForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: proses47a996573749e6c1251a26c002a7623c.url(args, options),
            method: 'post',
        })
    
    proses47a996573749e6c1251a26c002a7623c.form = proses47a996573749e6c1251a26c002a7623cForm
    /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
const proses8a78e6fd4f6e8db12503c2f540e2741c = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses8a78e6fd4f6e8db12503c2f540e2741c.url(args, options),
    method: 'post',
})

proses8a78e6fd4f6e8db12503c2f540e2741c.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/proses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
proses8a78e6fd4f6e8db12503c2f540e2741c.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return proses8a78e6fd4f6e8db12503c2f540e2741c.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
proses8a78e6fd4f6e8db12503c2f540e2741c.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses8a78e6fd4f6e8db12503c2f540e2741c.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
    const proses8a78e6fd4f6e8db12503c2f540e2741cForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: proses8a78e6fd4f6e8db12503c2f540e2741c.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
        proses8a78e6fd4f6e8db12503c2f540e2741cForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: proses8a78e6fd4f6e8db12503c2f540e2741c.url(args, options),
            method: 'post',
        })
    
    proses8a78e6fd4f6e8db12503c2f540e2741c.form = proses8a78e6fd4f6e8db12503c2f540e2741cForm

/**
* Multiple routes resolve to \App\Http\Controllers\PesananController::proses, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `proses['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const proses = {
    '/admin/pesanan/{pesanan}/proses': proses47a996573749e6c1251a26c002a7623c,
    '/kasir/pesanan/{pesanan}/proses': proses8a78e6fd4f6e8db12503c2f540e2741c,
}

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
const batal87bba7c8d3d491cfdd6017f4b8948749 = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal87bba7c8d3d491cfdd6017f4b8948749.url(args, options),
    method: 'post',
})

batal87bba7c8d3d491cfdd6017f4b8948749.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/batal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
batal87bba7c8d3d491cfdd6017f4b8948749.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return batal87bba7c8d3d491cfdd6017f4b8948749.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
batal87bba7c8d3d491cfdd6017f4b8948749.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal87bba7c8d3d491cfdd6017f4b8948749.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
    const batal87bba7c8d3d491cfdd6017f4b8948749Form = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batal87bba7c8d3d491cfdd6017f4b8948749.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
        batal87bba7c8d3d491cfdd6017f4b8948749Form.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batal87bba7c8d3d491cfdd6017f4b8948749.url(args, options),
            method: 'post',
        })
    
    batal87bba7c8d3d491cfdd6017f4b8948749.form = batal87bba7c8d3d491cfdd6017f4b8948749Form
    /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
const batal78945c2bd0a05347dc91c2ff2e10d5c2 = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal78945c2bd0a05347dc91c2ff2e10d5c2.url(args, options),
    method: 'post',
})

batal78945c2bd0a05347dc91c2ff2e10d5c2.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/batal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
batal78945c2bd0a05347dc91c2ff2e10d5c2.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pesanan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id_pesanan' in args) {
            args = { pesanan: args.id_pesanan }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pesanan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pesanan: typeof args.pesanan === 'object'
                ? args.pesanan.id_pesanan
                : args.pesanan,
                }

    return batal78945c2bd0a05347dc91c2ff2e10d5c2.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
batal78945c2bd0a05347dc91c2ff2e10d5c2.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal78945c2bd0a05347dc91c2ff2e10d5c2.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
    const batal78945c2bd0a05347dc91c2ff2e10d5c2Form = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batal78945c2bd0a05347dc91c2ff2e10d5c2.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
        batal78945c2bd0a05347dc91c2ff2e10d5c2Form.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batal78945c2bd0a05347dc91c2ff2e10d5c2.url(args, options),
            method: 'post',
        })
    
    batal78945c2bd0a05347dc91c2ff2e10d5c2.form = batal78945c2bd0a05347dc91c2ff2e10d5c2Form

/**
* Multiple routes resolve to \App\Http\Controllers\PesananController::batal, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `batal['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const batal = {
    '/admin/pesanan/{pesanan}/batal': batal87bba7c8d3d491cfdd6017f4b8948749,
    '/kasir/pesanan/{pesanan}/batal': batal78945c2bd0a05347dc91c2ff2e10d5c2,
}

const PesananController = { index, siap, edit, proses, batal }

export default PesananController