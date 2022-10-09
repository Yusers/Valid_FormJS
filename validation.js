function Validator(options) {
    const formElement = document.querySelector(options.form);
    // create selector object to save each rule
    const selectorRules = {};

    // Validate function
    function validate(inputElement, rule) {
        const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }


    if (formElement) {
        // prevent default
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name');
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        values[input.name] = input.value;
                        return values;
                    }, {});

                    options.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        }

        // Loop each rule
        options.rules.forEach(rule => {

            const inputElement = formElement.querySelector(rule.selector);
            const errorElement = inputElement.parentElement.querySelector(options.errorSelector);

            // Loop each rule and push test function into array;
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            if (inputElement) {
                // onchange event
                inputElement.onchange = function() {
                    validate(inputElement, rule);
                }

                // oninput event
                inputElement.oninput = function() {
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

Validator.isRequired = function(selector, message = 'Vui lòng không để trống') {
    return {
        selector: selector,
        test: function(value) {
            return value.trim().length > 0 ? undefined : message;
        }
    };
}

Validator.isEmail = function(selector, message = 'Vui lòng nhập đúng vd: email@gmail.com') {
    return {
        selector: selector,
        test: function(value) {
            const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regexEmail.test(value) ? undefined : message;
        }
    };
}

Validator.minLength = function(selector, min = 6, message = `Vui lòng nhập đủ ${min} ký tự trở lên`) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim().length >= min ? undefined : message;
        }
    };
}

Validator.isConfirm = function(selector, getComfirm, message = 'Giá trị không chính xác') {
    return {
        selector: selector,
        test: function(value) {
            return value === getComfirm() ? undefined : message;
        }
    };
}