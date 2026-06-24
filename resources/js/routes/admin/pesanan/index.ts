import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
export const siap = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siap.url(args, options),
    method: 'post',
})

siap.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/siap',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
siap.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
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

    return siap.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
siap.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siap.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
    const siapForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: siap.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::siap
 * @see app/Http/Controllers/PesananController.php:81
 * @route '/admin/pesanan/{pesanan}/siap'
 */
        siapForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: siap.url(args, options),
            method: 'post',
        })
    
    siap.form = siapForm
/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
export const edit = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: edit.url(args, options),
    method: 'post',
})

edit.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/edit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
edit.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
edit.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: edit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
    const editForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: edit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::edit
 * @see app/Http/Controllers/PesananController.php:97
 * @route '/admin/pesanan/{pesanan}/edit'
 */
        editForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: edit.url(args, options),
            method: 'post',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
export const proses = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses.url(args, options),
    method: 'post',
})

proses.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/proses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
proses.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
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

    return proses.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
proses.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
    const prosesForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: proses.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::proses
 * @see app/Http/Controllers/PesananController.php:122
 * @route '/admin/pesanan/{pesanan}/proses'
 */
        prosesForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: proses.url(args, options),
            method: 'post',
        })
    
    proses.form = prosesForm
/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
export const batal = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal.url(args, options),
    method: 'post',
})

batal.definition = {
    methods: ["post"],
    url: '/admin/pesanan/{pesanan}/batal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
batal.url = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions) => {
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

    return batal.definition.url
            .replace('{pesanan}', parsedArgs.pesanan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
batal.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
    const batalForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batal.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PesananController::batal
 * @see app/Http/Controllers/PesananController.php:182
 * @route '/admin/pesanan/{pesanan}/batal'
 */
        batalForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batal.url(args, options),
            method: 'post',
        })
    
    batal.form = batalForm
const pesanan = {
    siap: Object.assign(siap, siap),
edit: Object.assign(edit, edit),
proses: Object.assign(proses, proses),
batal: Object.assign(batal, batal),
}

export default pesanan