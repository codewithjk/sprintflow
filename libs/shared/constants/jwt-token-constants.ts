
export const ACCESS_TOKEN_EXPIRATION :number = 900;   // 15 minutes
export const REFRESH_TOKEN_EXPIRATION :number= 604800;   // 7 days


export enum TokenNames {
    ORG_ACCESS_TOKEN = "org_access_token",
    ORG_REFRESH_TOKEN = "org_refresh_token",
    SUPER_ADMIN_ACCESS_TOKEN = "super_admin_access_token",
    SUPER_ADMIN_REFRESH_TOKEN = "super_admin_refresh_token",
    USER_ACCESS_TOKEN = "user_access_token",
    USER_REFRESH_TOKEN = "user_refresh_token",
}

export enum TokenType {
    ACCESS_TOKEN = "access",
    REFRESH_TOKEN = "refresh",
}