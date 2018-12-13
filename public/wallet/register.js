const registerBtn = '#registerBtn';

const emailRegisterForm = '#emailRegisterForm';

$(emailRegisterForm).validate({
    rules: {
        email: {
            required: true,
            email: true,
            remote: {}
        },
        agree_term: {
            required: true,
        },
        password: {
            minlength: 8,
            regexPass: true,
            required: true,
        },
        password_confirmation: {
            regexPass: true,
            equalTo: "#password",
            required: true,
        },
    },
    messages: {
        agree_term: {
            required: "",
        }
    }
});


$('#agree_term').click(function () {
    showAgreeError()
});

function showAgreeError() {
    if ($('#agree_term').is(":checked")) {
        $('#agreeError').addClass('d-none');
    } else {
        $('#agreeError').removeClass('d-none');
    }
}

$(emailRegisterForm).submit(function (e) {
    showAgreeError()
    if ($(emailRegisterForm).valid()) {
        const self = $(this);
        register(self);
    }
});

const passportRegisterForm = '#passportRegisterForm';

$(passportRegisterForm).validate({
    rules: {
        passport_number: {
            passport_check: true,
            required: true,
            remote: {}
        },
        agree_term: {
            required: true,
        },
        password: {
            minlength: 8,
            regexPass: true,
            required: true,
        },
        password_confirmation: {
            regexPass: true,
            equalTo: "#password",
            required: true,
        },
    },
    messages: {
        agree_term: {
            required: "",
        }
    }
});

$(passportRegisterForm).submit(function (e) {
    showAgreeError();
    if ($(passportRegisterForm).valid()) {
        const self = $(this);
        register(self);
    }
});


const phoneRegisterForm = '#phoneRegisterForm';

$(phoneRegisterForm).validate({
    rules: {
        phone: {
            phone_check_register: true,
            remote: {}
        },
        agree_term: {
            required: true,
        },
        password: {
            minlength: 8,
            regexPass: true,
            required: true,
        },
        password_confirmation: {
            regexPass: true,
            equalTo: "#password",
            required: true,
        },
    },
    messages: {
        password_confirmation: {
            equalTo: "THOSE PASSWORDS DIDN'T MATCH. TRY AGAIN."
        },
        agree_term: {
            required: "",
        }
    }
});

$(phoneRegisterForm).submit(function (e) {
    showAgreeError();
    e.preventDefault();
    if ($(phoneRegisterForm).valid()) {
        const self = $(this);
        setTimeout(function () {
            register(self);
        }, 1000);
    }
});

function register(self) {
    const wallet = ethers.Wallet.createRandom();
    const mnemonicHash = CryptoJS.SHA256(wallet.mnemonic);
    $('#eth_address').val(wallet.address);
    $('#mnemonic').val(mnemonicHash.toString());
    const url = self.attr('action');
    const data = self.serialize();
    $(registerBtn).hide();
    $.ajax({
        url: url,
        data: data,
        method: 'POST',
        success: function (result) {
            console.log(result);
            if (result.status) {
                const publicKey = result.data;
                saveKey(publicKey, wallet.privateKey);
                saveMnemonic(publicKey, wallet.mnemonic);
                toastr.success(result.message);
                location.href = '/wallet/dashboard';
            } else {
                toastr.error(result.message);
                $(registerBtn).show();
            }
        },
        error: function (error) {
            const errorMessages = error.responseJSON.errors;
            toastr.error(textError(errorMessages), '', 10000);
            $(registerBtn).show();
        }
    });
}

const mnemonicRegister = '#mnemonicRegister';
const mnemonicText = '#mnemonicText';
const mnemonicQr = '#mnemonicQr';

function showMnemonic(mnemonic) {
    $(mnemonicText).html(mnemonic);
    $(mnemonicQr).html('').qrcode({
        size: '200',
        render: 'image',
        text: mnemonic
    });
    $(mnemonicRegister).modal('show');
}

function textError(errorMessages) {
    let textErrors = '';
    for (let i in errorMessages) {
        for (let j of errorMessages[i]) {
            textErrors += j;
        }
    }
    return textErrors;
}
