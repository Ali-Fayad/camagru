export const API_BASE_URL = "/index.php";

export const API_ENDPOINTS = {
    login: "user/login",
    signup: "user/signup",
    updateUser: "user/update",
    deleteUser: "user/delete",
    verifyEmail: "mailer/verify",
    sendCode: "mailer",
    getPosts: "posts/get",
    addPost: "posts/add",
    getStickers: "posts/stickers",
    like: "like",
    comment: "comment"
};

export const SESSION_KEYS = {
    token: "camagru:token",
    user: "camagru:user"
};

export const ROUTE_PATHS = {
    home: "home",
    gallery: "gallery",
    login: "login",
    signup: "signup",
    post: "post",
    settings: "settings",
    password: "password"
};

export const PUBLIC_ROUTES = [ROUTE_PATHS.home, ROUTE_PATHS.login, ROUTE_PATHS.signup, ROUTE_PATHS.password];

export const DEFAULT_ROUTE = ROUTE_PATHS.home;
