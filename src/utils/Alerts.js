import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

export function succeedAlert() {
    Toast.fire({
        icon: "success",
        title: "Processed successfully"
    });
}

export function errorAlert(errorMessage) {
    return Swal.fire({
        type: "error",
        title: "Oops...",
        text: errorMessage,
        heightAuto: false
    });
}