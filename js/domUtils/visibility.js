export function visibility(eye, passwordField, confirmField = null) {
    eye.addEventListener("click", () => {
        const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);
        if (confirmField) {
            confirmField.setAttribute("type", type);
        }
        eye.style.color = type === "password" ? "#3c4043" : "#4285f4";
    });
}