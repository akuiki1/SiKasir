import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
//#region resources/js/routes/verification/index.ts
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
var notice = (options) => ({
	url: notice.url(options),
	method: "get"
});
notice.definition = {
	methods: ["get", "head"],
	url: "/email/verify"
};
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
notice.url = (options) => {
	return notice.definition.url + queryParams(options);
};
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
notice.get = (options) => ({
	url: notice.url(options),
	method: "get"
});
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
notice.head = (options) => ({
	url: notice.url(options),
	method: "head"
});
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
var noticeForm = (options) => ({
	action: notice.url(options),
	method: "get"
});
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
noticeForm.get = (options) => ({
	action: notice.url(options),
	method: "get"
});
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationPromptController::notice
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationPromptController.php:18
* @route '/email/verify'
*/
noticeForm.head = (options) => ({
	action: notice.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
notice.form = noticeForm;
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
var verify = (args, options) => ({
	url: verify.url(args, options),
	method: "get"
});
verify.definition = {
	methods: ["get", "head"],
	url: "/email/verify/{id}/{hash}"
};
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
verify.url = (args, options) => {
	if (Array.isArray(args)) args = {
		id: args[0],
		hash: args[1]
	};
	args = applyUrlDefaults(args);
	const parsedArgs = {
		id: args.id,
		hash: args.hash
	};
	return verify.definition.url.replace("{id}", parsedArgs.id.toString()).replace("{hash}", parsedArgs.hash.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
verify.get = (args, options) => ({
	url: verify.url(args, options),
	method: "get"
});
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
verify.head = (args, options) => ({
	url: verify.url(args, options),
	method: "head"
});
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
var verifyForm = (args, options) => ({
	action: verify.url(args, options),
	method: "get"
});
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
verifyForm.get = (args, options) => ({
	action: verify.url(args, options),
	method: "get"
});
/**
* @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::verify
* @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
* @route '/email/verify/{id}/{hash}'
*/
verifyForm.head = (args, options) => ({
	action: verify.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
verify.form = verifyForm;
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
* @route '/email/verification-notification'
*/
var send = (options) => ({
	url: send.url(options),
	method: "post"
});
send.definition = {
	methods: ["post"],
	url: "/email/verification-notification"
};
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
* @route '/email/verification-notification'
*/
send.url = (options) => {
	return send.definition.url + queryParams(options);
};
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
* @route '/email/verification-notification'
*/
send.post = (options) => ({
	url: send.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
* @route '/email/verification-notification'
*/
var sendForm = (options) => ({
	action: send.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
* @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
* @route '/email/verification-notification'
*/
sendForm.post = (options) => ({
	action: send.url(options),
	method: "post"
});
send.form = sendForm;
Object.assign(notice, notice), Object.assign(verify, verify), Object.assign(send, send);
//#endregion
export { send as t };

//# sourceMappingURL=verification-B4VXILzx.js.map