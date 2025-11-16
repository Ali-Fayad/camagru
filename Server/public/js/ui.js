export const Toast = {
    push(message, tone = "info") {
        window.dispatchEvent(new CustomEvent("spa:toast", { detail: { message, tone } }));
    }
};
    