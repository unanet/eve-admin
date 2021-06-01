const Swal = require("./third-party/sweetalert2/sweetalert2.min")

const _GrowlMixin = {
    name: "Growl",
    data() {
        return {
            toast: {}
        }
    },
    created() {
        (this as any).toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    },
    methods: {
        showSuccessAlert(message: string) {
            this._showAlert('success', message);
        },
        showInfoAlert(message: string) {
            this._showAlert('info', message);
        },
        showErrorAlert(message: string) {
            this._showAlert('error', message);
        },
        showWarningAlert(message: string) {
            this._showAlert('warning', message);
        },
        showDefaultAlert(message: string) {
            this._showAlert('question', message);
        },
        _showAlert(icon: string, message: string) {
            (this as any).toast.fire({
                icon: icon,
                title: message,
            })
        }
    }
};

export { _GrowlMixin }
