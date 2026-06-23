import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kasir/pesanan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KasirPesananController::index
 * @see app/Http/Controllers/KasirPesananController.php:24
 * @route '/kasir/pesanan'
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
* @see \App\Http\Controllers\KasirPesananController::siap
 * @see app/Http/Controllers/KasirPesananController.php:48
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
export const siap = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siap.url(args, options),
    method: 'post',
})

siap.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/siap',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KasirPesananController::siap
 * @see app/Http/Controllers/KasirPesananController.php:48
 * @route '/kasir/pesanan/{pesanan}/siap'
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
* @see \App\Http\Controllers\KasirPesananController::siap
 * @see app/Http/Controllers/KasirPesananController.php:48
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
siap.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: siap.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KasirPesananController::siap
 * @see app/Http/Controllers/KasirPesananController.php:48
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
    const siapForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: siap.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KasirPesananController::siap
 * @see app/Http/Controllers/KasirPesananController.php:48
 * @route '/kasir/pesanan/{pesanan}/siap'
 */
        siapForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: siap.url(args, options),
            method: 'post',
        })
    
    siap.form = siapForm
/**
* @see \App\Http\Controllers\KasirPesananController::proses
 * @see app/Http/Controllers/KasirPesananController.php:70
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
export const proses = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses.url(args, options),
    method: 'post',
})

proses.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/proses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KasirPesananController::proses
 * @see app/Http/Controllers/KasirPesananController.php:70
 * @route '/kasir/pesanan/{pesanan}/proses'
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
* @see \App\Http\Controllers\KasirPesananController::proses
 * @see app/Http/Controllers/KasirPesananController.php:70
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
proses.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proses.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KasirPesananController::proses
 * @see app/Http/Controllers/KasirPesananController.php:70
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
    const prosesForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: proses.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KasirPesananController::proses
 * @see app/Http/Controllers/KasirPesananController.php:70
 * @route '/kasir/pesanan/{pesanan}/proses'
 */
        prosesForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: proses.url(args, options),
            method: 'post',
        })
    
    proses.form = prosesForm
/**
* @see \App\Http\Controllers\KasirPesananController::batal
 * @see app/Http/Controllers/KasirPesananController.php:134
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
export const batal = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal.url(args, options),
    method: 'post',
})

batal.definition = {
    methods: ["post"],
    url: '/kasir/pesanan/{pesanan}/batal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KasirPesananController::batal
 * @see app/Http/Controllers/KasirPesananController.php:134
 * @route '/kasir/pesanan/{pesanan}/batal'
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
* @see \App\Http\Controllers\KasirPesananController::batal
 * @see app/Http/Controllers/KasirPesananController.php:134
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
batal.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batal.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KasirPesananController::batal
 * @see app/Http/Controllers/KasirPesananController.php:134
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
    const batalForm = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: batal.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KasirPesananController::batal
 * @see app/Http/Controllers/KasirPesananController.php:134
 * @route '/kasir/pesanan/{pesanan}/batal'
 */
        batalForm.post = (args: { pesanan: number | { id_pesanan: number } } | [pesanan: number | { id_pesanan: number } ] | number | { id_pesanan: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: batal.url(args, options),
            method: 'post',
        })
    
    batal.form = batalForm
const KasirPesananController = { index, siap, proses, batal }

export default KasirPesananController