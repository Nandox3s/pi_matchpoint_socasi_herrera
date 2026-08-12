module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-rsc] (ecmascript)");
;
;
const dynamic = "force-dynamic";
async function RootPage() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(session ? "/dashboard" : "/login");
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/session.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
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
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return store.get(ACCESS_COOKIE)?.value ?? null;
}
async function readRefreshToken() {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return store.get(REFRESH_COOKIE)?.value ?? null;
}
async function getSession() {
    const token = await readAccessToken();
    return token ? sessionFromToken(token) : null;
}
async function saveTokens(accessToken, refreshToken) {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    store.delete(ACCESS_COOKIE);
    store.delete(REFRESH_COOKIE);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1_-0o4v._.js.map