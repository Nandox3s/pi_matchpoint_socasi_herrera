module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/api/backend/[...path]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cognito$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cognito.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-route] (ecmascript)");
;
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const HOP_BY_HOP = new Set([
    "connection",
    "keep-alive",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length"
]);
async function forward(request, path) {
    const target = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/${path.join("/")}${request.nextUrl.search}`;
    const accessToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readAccessToken"])();
    if (!accessToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "unauthenticated"
        }, {
            status: 401
        });
    }
    const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
    const headers = new Headers();
    request.headers.forEach((value, key)=>{
        if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "cookie") {
            headers.set(key, value);
        }
    });
    if (body) headers.set("content-type", request.headers.get("content-type") ?? "application/json");
    const send = (token)=>fetch(target, {
            method: request.method,
            headers: new Headers([
                ...headers.entries(),
                [
                    "authorization",
                    `Bearer ${token}`
                ]
            ]),
            body: body && body.length > 0 ? body : undefined,
            cache: "no-store",
            redirect: "manual"
        });
    let upstream;
    try {
        upstream = await send(accessToken);
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `No se pudo conectar con el backend (${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["API_BASE_URL"]}). Verifica que el gateway esté encendido.`
        }, {
            status: 503
        });
    }
    if (upstream.status === 401) {
        const refreshToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readRefreshToken"])();
        const renewed = refreshToken ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cognito$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refresh"])(refreshToken) : null;
        if (renewed) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveTokens"])(renewed.accessToken, renewed.refreshToken);
            try {
                upstream = await send(renewed.accessToken);
            } catch  {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "No se pudo conectar con el backend."
                }, {
                    status: 503
                });
            }
        } else {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearTokens"])();
        }
    }
    const payload = await upstream.text();
    const response = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](payload || null, {
        status: upstream.status
    });
    const contentType = upstream.headers.get("content-type");
    if (contentType) response.headers.set("content-type", contentType);
    return response;
}
async function handler(request, context) {
    const { path } = await context.params;
    return forward(request, path);
}
const GET = handler;
const POST = handler;
const PUT = handler;
const PATCH = handler;
const DELETE = handler;
}),
"[project]/src/lib/cognito.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CognitoError",
    ()=>CognitoError,
    "login",
    ()=>login,
    "refresh",
    ()=>refresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
;
;
class CognitoError extends Error {
    code;
    constructor(message, code){
        super(message);
        this.name = "CognitoError";
        this.code = code;
    }
}
const FRIENDLY_ERRORS = {
    NotAuthorizedException: "Usuario o contraseña incorrectos.",
    UserNotFoundException: "Usuario o contraseña incorrectos.",
    UserNotConfirmedException: "La cuenta aún no está confirmada en Cognito.",
    PasswordResetRequiredException: "Debes restablecer tu contraseña en Cognito.",
    TooManyRequestsException: "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
    InvalidParameterException: "Cognito rechazó la petición. Verifica que el App Client sea público (sin secret) y tenga ALLOW_USER_AUTH habilitado.",
    ResourceNotFoundException: "El App Client de Cognito no existe en esta región. Revisa COGNITO_APP_CLIENT_ID y COGNITO_REGION."
};
async function callCognito(target, body) {
    const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COGNITO_ENDPOINT"], {
        method: "POST",
        headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`
        },
        body: JSON.stringify(body),
        cache: "no-store"
    });
    const raw = await response.text();
    const payload = raw ? JSON.parse(raw) : {};
    if (!response.ok) {
        const error = payload;
        const code = (error.__type ?? "UnknownException").split("#").pop() ?? "UnknownException";
        throw new CognitoError(FRIENDLY_ERRORS[code] ?? error.message ?? "No se pudo autenticar con Cognito.", code);
    }
    return payload;
}
async function login(username, password) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertCognitoConfigured"])();
    const start = await callCognito("InitiateAuth", {
        AuthFlow: "USER_AUTH",
        ClientId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COGNITO_APP_CLIENT_ID"],
        AuthParameters: {
            USERNAME: username,
            PREFERRED_CHALLENGE: "PASSWORD"
        }
    });
    let response = start;
    if (!start.AuthenticationResult) {
        if (start.ChallengeName !== "PASSWORD" || !start.Session) {
            throw new CognitoError(`Cognito requiere completar el desafío ${start.ChallengeName ?? "desconocido"}, que esta aplicación no maneja.`, start.ChallengeName ?? "UnsupportedChallenge");
        }
        response = await callCognito("RespondToAuthChallenge", {
            ChallengeName: "PASSWORD",
            ClientId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COGNITO_APP_CLIENT_ID"],
            Session: start.Session,
            ChallengeResponses: {
                USERNAME: username,
                PASSWORD: password
            }
        });
    }
    const result = response.AuthenticationResult;
    if (!result?.AccessToken) {
        throw new CognitoError("No se pudo completar la autenticación de Cognito.", "MissingAccessToken");
    }
    return {
        accessToken: result.AccessToken,
        refreshToken: result.RefreshToken,
        expiresIn: result.ExpiresIn ?? 3600
    };
}
async function refresh(refreshToken) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COGNITO_APP_CLIENT_ID"]) return null;
    try {
        const response = await callCognito("InitiateAuth", {
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COGNITO_APP_CLIENT_ID"],
            AuthParameters: {
                REFRESH_TOKEN: refreshToken
            }
        });
        const result = response.AuthenticationResult;
        if (!result?.AccessToken) return null;
        return {
            accessToken: result.AccessToken,
            refreshToken: result.RefreshToken,
            expiresIn: result.ExpiresIn ?? 3600
        };
    } catch  {
        return null;
    }
}
}),
"[project]/src/lib/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "COGNITO_APP_CLIENT_ID",
    ()=>COGNITO_APP_CLIENT_ID,
    "COGNITO_ENDPOINT",
    ()=>COGNITO_ENDPOINT,
    "COGNITO_REGION",
    ()=>COGNITO_REGION,
    "COGNITO_USER_POOL_ID",
    ()=>COGNITO_USER_POOL_ID,
    "assertCognitoConfigured",
    ()=>assertCognitoConfigured
]);
;
/**
 * Configuracion de servidor. Ninguno de estos valores llega al navegador:
 * el token nunca sale de las funciones serverless.
 */ function trimSlash(value) {
    return value.replace(/\/+$/, "");
}
const API_BASE_URL = trimSlash(process.env.API_BASE_URL ?? "http://18.234.231.25:9090");
const COGNITO_REGION = process.env.COGNITO_REGION ?? "us-east-1";
const COGNITO_APP_CLIENT_ID = (process.env.COGNITO_APP_CLIENT_ID ?? "").trim();
const COGNITO_USER_POOL_ID = (process.env.COGNITO_USER_POOL_ID ?? "").trim();
const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;
function assertCognitoConfigured() {
    if (!COGNITO_APP_CLIENT_ID) {
        throw new Error("Falta COGNITO_APP_CLIENT_ID. Configúralo en las variables de entorno de Vercel (Settings → Environment Variables) o en web/.env.local para desarrollo.");
    }
}
}),
"[project]/src/lib/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCESS_COOKIE",
    ()=>ACCESS_COOKIE,
    "REFRESH_COOKIE",
    ()=>REFRESH_COOKIE,
    "clearTokens",
    ()=>clearTokens,
    "decodeAccessToken",
    ()=>decodeAccessToken,
    "getSession",
    ()=>getSession,
    "readAccessToken",
    ()=>readAccessToken,
    "readRefreshToken",
    ()=>readRefreshToken,
    "roleFromGroups",
    ()=>roleFromGroups,
    "saveTokens",
    ()=>saveTokens,
    "sessionFromToken",
    ()=>sessionFromToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const ACCESS_COOKIE = "mp_access";
const REFRESH_COOKIE = "mp_refresh";
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: ("TURBOPACK compile-time value", "development") === "production",
    path: "/"
};
function decodeAccessToken(token) {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");
        return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    } catch  {
        return null;
    }
}
function roleFromGroups(groups) {
    if (!groups) return null;
    if (groups.includes("MANAGER")) return "MANAGER";
    if (groups.includes("PLAYER")) return "PLAYER";
    return null;
}
function sessionFromToken(token) {
    const claims = decodeAccessToken(token);
    if (!claims) return null;
    const groups = claims["cognito:groups"] ?? [];
    const role = roleFromGroups(groups);
    if (!role) return null;
    return {
        username: claims.username ?? claims["cognito:username"] ?? claims.sub ?? "usuario",
        role,
        groups,
        expiresAt: (claims.exp ?? 0) * 1000
    };
}
async function readAccessToken() {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return store.get(ACCESS_COOKIE)?.value ?? null;
}
async function readRefreshToken() {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return store.get(REFRESH_COOKIE)?.value ?? null;
}
async function getSession() {
    const token = await readAccessToken();
    return token ? sessionFromToken(token) : null;
}
async function saveTokens(accessToken, refreshToken) {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    // El access token dura ~1h; la cookie se mantiene 30 dias para poder refrescarlo.
    store.set(ACCESS_COOKIE, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30
    });
    if (refreshToken) {
        store.set(REFRESH_COOKIE, refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 30
        });
    }
}
async function clearTokens() {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    store.delete(ACCESS_COOKIE);
    store.delete(REFRESH_COOKIE);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0035may._.js.map