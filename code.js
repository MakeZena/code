/*
  * Title : Visametric autofill
  * Author: Naderidev
  * Github: https://github.com/naderidev
*/

if (window.location.href === 'https://ir-appointment.visametric.com/ir'){
    $(document).ready(function (){
        const element = $("#legalizationBtn")
        element.trigger('click')
    })

}

if (window.location.href === 'https://ir-appointment.visametric.com/ir/Legalization'){
    $(document).ready(function (){
        $('#result0').trigger('click')
        $('#result1').trigger('click')
        $('#btnSubmit').trigger('click')
    })

  
}

if (window.location.href === 'https://ir-appointment.visametric.com/ir/appointment-form') {
    $(document).ready(function () {
        clearInterval(x)

        // Config -->
        if (typeof VA_CONFIG === 'undefined') {
            console.log('ERROR: VA_CONFIG not found! please define your own config.')
            return null
        } else {
            // Start -->
            let totalRequests = 0
            const limitRequests = 20

            function prevent429(requests = 1) {
                totalRequests += requests
                if (totalRequests > limitRequests) {
                    window.location.reload()
                }
            }

            function wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            function selectCityStep(reload = false) {
                const cityElement = $("#city")
                if (cityElement.find('option[value="' + VA_CONFIG['city'] + '"]') !== undefined) {
                    prevent429()
                    cityElement.val(VA_CONFIG['city'])
                    cityElement.trigger('change')
                    console.log('STEP 1 --> City ' + (reload ? 'reloaded' : 'selected'))
                    selectOfficeStep()
                } else {
                    if (!reload) {
                        window.location.reload()
                    }
                }
            }

            function selectOfficeStep() {
                const officeElement = $("#office")
                if (officeElement.find('option[value="' + VA_CONFIG['office'] + '"]') !== undefined) {
                    prevent429()
                    officeElement.val(VA_CONFIG['office'])
                    officeElement.trigger('change')
                    console.log('STEP 2 --> Office selected')
                    selectOfficeType()

                } else {
                    console.log('STEP 5 --> Failed in loading offices! retrying...')
                    wait(3000).then(r => {
                        selectCityStep(true)
                    })

                }
            }

            function selectOfficeType() {
                const officeTypeElement = $("#officetype")
                officeTypeElement.val(VA_CONFIG['officeType'])
                officeTypeElement.trigger('change')
                console.log('STEP 3 --> Office type selected')
                selectTotalPerson()
            }

            function selectTotalPerson() {
                const totalPersonElement = $("#totalPerson")
                prevent429(2)
                totalPersonElement.val(VA_CONFIG['persons'].length)
                totalPersonElement.trigger('change')
                if ($('.setnewcalendarstatus').val() !== '' && $('#totalFEE').text() !== '') {
                    console.log('STEP 4 --> Total person selected')
                    selectAndFillPaymentInfo()
                } else {
                    console.log('STEP 5 --> Total person selection failed! retrying...')
                    wait(4000).then(r => {
                        selectTotalPerson()
                    })
                }
            }

            function selectAndFillPaymentInfo() {
                const cardNumberElement = $('#paymentCardInput')
                const cardDateElement = $('#popupDatepicker2')
                const payTypeCardElement = $('#atm')
                const checkBtn = $('#checkCardListBtn')
                const paymentCheckList = $("#checkCardListDiv")
                const next = $('#btnAppCountNext')
                payTypeCardElement.trigger('click')
                cardNumberElement.val(VA_CONFIG['card']['number'])
                cardDateElement.val(VA_CONFIG['card']['date'])
                checkBtn.trigger('click')
                prevent429()
                const payment = paymentCheckList.find("input[class='bankpaymentRadio']")
                if (payment !== undefined) {
                    payment[0].click()
                    next.trigger('click')
                    prevent429()
                    console.log('STEP 5 --> Payment selected & first section finished')
                    fillPersonalData()
                } else {
                    console.log('STEP 5 --> Failed in loading payment! retrying...')
                    wait(3000).then(r => {
                        selectAndFillPaymentInfo()
                    })
                }
            }

            function fillPersonalData() {
                const shebaNumberElement = $('#scheba_number')
                const shebaHolderNameElement = $('#scheba_name')
                const next1 = $('#btnAppPersonalNext')
                const previewCheckCheckBox = $('#previewchk')
                const next2 = $('#btnAppPreviewNext')
                shebaNumberElement.val(VA_CONFIG['sheba']['number'])
                shebaHolderNameElement.val(VA_CONFIG['sheba']['holderName'])
                VA_CONFIG['persons'].forEach(function (person, i) {
                    const index = i + 1
                    $('#name' + index).val(person['name'])
                    $('#surname' + index).val(person['surname'])
                    $('#birthyear' + index).val(person['birthDate'][0])
                    $('#birthmonth' + index).val(person['birthDate'][1])
                    $('#birthday' + index).val(person['birthDate'][2])
                    $('#passport' + index).val(person['passport'])
                    $('#phone' + index).val(person['phone'])
                    $('#email' + index).val(person['email'])
                })
                next1.trigger('click')
                previewCheckCheckBox.trigger('click')
                next2.trigger('click')
                prevent429(2)
                console.log('STEP 6 --> Personal detail form filled & second section finished')

                $('body').append(
                    '<button id="reload-datepicker" class="btn btn-dark p-3 fs-5" style="position: fixed; bottom: 20px; left: 20px">RELOAD DATE</button>'
                )

                $("#reload-datepicker").on('click', function () {
                    next2.trigger('click')
                    prevent429(2)
                    console.log('Notice: Date reloaded!')
                    alert('Datepicker reloaded!')
                })

            }
            
            selectCityStep()

        }
    })
}








// ==UserScript==
// @name         visa form
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ir-appointment.visametric.com/ir/appointment-form
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visametric.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const VA_CONFIG = {
  'city': 28,
  'office': 1,
  'officeType': 1,
  'card': {
    'number': '6037997513387697',
    'date': '1402/06/16'
  },
  'sheba': {
    'number': 'IR330170000000220941003002',
    'holderName': 'محمود اسلامی' // in persian
  },
  'persons': [{
      'name': 'Mahmoud',
      'surname': 'Eslami',
      'birthDate': [
        '1998', // Year
        '04', // Month
        '06' // Day
      ],
      'passport': 'W60876309',
      'phone': '09115197798',
      'email': 'mahmoudeslami@hotmail.com'
    },
    // ...
  ]
}

    $(document).ready(function () {
        clearInterval(x)

        // Config -->
        if (typeof VA_CONFIG === 'undefined') {
            console.log('ERROR: VA_CONFIG not found! please define your own config.')
            return null
        } else {
            // Start -->
            let totalRequests = 0
            const limitRequests = 20

            function prevent429(requests = 1) {
                totalRequests += requests
                if (totalRequests > limitRequests) {
                    window.location.reload()
                }
            }

            function wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            function selectCityStep(reload = false) {
                const cityElement = $("#city")
                if (cityElement.find('option[value="' + VA_CONFIG['city'] + '"]') !== undefined) {
                    prevent429()
                    cityElement.val(VA_CONFIG['city'])
                    cityElement.trigger('change')
                    console.log('STEP 1 --> City ' + (reload ? 'reloaded' : 'selected'))
                    selectOfficeStep()
                } else {
                    if (!reload) {
                        window.location.reload()
                    }
                }
            }

            function selectOfficeStep() {
                const officeElement = $("#office")
                if (officeElement.find('option[value="' + VA_CONFIG['office'] + '"]') !== undefined) {
                    prevent429()
                    officeElement.val(VA_CONFIG['office'])
                    officeElement.trigger('change')
                    console.log('STEP 2 --> Office selected')
                    selectOfficeType()

                } else {
                    console.log('STEP 5 --> Failed in loading offices! retrying...')
                    wait(3000).then(r => {
                        selectCityStep(true)
                    })

                }
            }

            function selectOfficeType() {
                const officeTypeElement = $("#officetype")
                officeTypeElement.val(VA_CONFIG['officeType'])
                officeTypeElement.trigger('change')
                console.log('STEP 3 --> Office type selected')
                selectTotalPerson()
            }

            function selectTotalPerson() {
                const totalPersonElement = $("#totalPerson")
                prevent429(2)
                totalPersonElement.val(VA_CONFIG['persons'].length)
                totalPersonElement.trigger('change')
                if ($('.setnewcalendarstatus').val() !== '' && $('#totalFEE').text() !== '') {
                    console.log('STEP 4 --> Total person selected')
                    selectAndFillPaymentInfo()
                } else {
                    console.log('STEP 5 --> Total person selection failed! retrying...')
                    wait(4000).then(r => {
                        selectTotalPerson()
                    })
                }
            }

            function selectAndFillPaymentInfo() {
                const cardNumberElement = $('#paymentCardInput')
                const cardDateElement = $('#popupDatepicker2')
                const payTypeCardElement = $('#atm')
                const checkBtn = $('#checkCardListBtn')
                const paymentCheckList = $("#checkCardListDiv")
                const next = $('#btnAppCountNext')
                payTypeCardElement.trigger('click')
                cardNumberElement.val(VA_CONFIG['card']['number'])
                cardDateElement.val(VA_CONFIG['card']['date'])
                checkBtn.trigger('click')
                prevent429()
                const payment = paymentCheckList.find("input[class='bankpaymentRadio']")
                if (payment !== undefined) {
                    payment[0].click()
                    next.trigger('click')
                    prevent429()
                    console.log('STEP 5 --> Payment selected & first section finished')
                    fillPersonalData()
                } else {
                    console.log('STEP 5 --> Failed in loading payment! retrying...')
                    wait(3000).then(r => {
                        selectAndFillPaymentInfo()
                    })
                }
            }

            function fillPersonalData() {
                const shebaNumberElement = $('#scheba_number')
                const shebaHolderNameElement = $('#scheba_name')
                const next1 = $('#btnAppPersonalNext')
                const previewCheckCheckBox = $('#previewchk')
                const next2 = $('#btnAppPreviewNext')
                shebaNumberElement.val(VA_CONFIG['sheba']['number'])
                shebaHolderNameElement.val(VA_CONFIG['sheba']['holderName'])
                VA_CONFIG['persons'].forEach(function (person, i) {
                    const index = i + 1
                    $('#name' + index).val(person['name'])
                    $('#surname' + index).val(person['surname'])
                    $('#birthyear' + index).val(person['birthDate'][0])
                    $('#birthmonth' + index).val(person['birthDate'][1])
                    $('#birthday' + index).val(person['birthDate'][2])
                    $('#passport' + index).val(person['passport'])
                    $('#phone' + index).val(person['phone'])
                    $('#email' + index).val(person['email'])
                })
                next1.trigger('click')
                previewCheckCheckBox.trigger('click')
                next2.trigger('click')
                prevent429(2)
                console.log('STEP 6 --> Personal detail form filled & second section finished')

               updateCalenderButton()
                sendTelegramMessage()

            }

            function updateCalenderButton() {
                 $('body').append(
                    '<button id="reload-datepicker" class="btn btn-dark p-3 fs-5" style="position: fixed; bottom: 20px; left: 20px">RELOAD DATE</button>'
                )

                $("#reload-datepicker").on('click', function () {
                    next2.trigger('click')
                    prevent429(2)
                    console.log('Notice: Date reloaded!')
                    alert('Datepicker reloaded!')
                })
            }

            function sendTelegramMessage(){
                const botToken = 'YOUR_BOT_TOKEN';
                const chatId = 'YOUR_CHAT_ID';
                const message = 'Hello, this is a message from your bot!';

                const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `chat_id=${chatId}&text=${encodeURIComponent(message)}`,
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Message sent:', data);
                })
                    .catch(error => {
                    console.error('Error sending message:', error);
                });
            }

            selectCityStep()

        }
    })
})();