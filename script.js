//---> SELECTORS

// side panel
const sidebar = document.querySelector('[data-sidebar]')
const openBtn = document.querySelector('[data-open]')
const closeBtn = document.querySelector('[data-close]')

// cash register init form
const cashInitForm = document.querySelector('[data-cash-init-form]')
const cashInitInput = document.querySelector('[data-cash-init-value]')
const submitBtn = document.querySelector('[data-cash-init-submit]')
const amendBtn = document.querySelector('[data-cash-init-clear]')
const resetRegisterBtn = document.querySelector('[data-register-reset]')

// display
const displayVoidMode = document.querySelector('[data-display]')
const cancelBtn = document.querySelector('[data-cancel]')
const restartBtn = document.querySelector('[data-restart]')
const prevDisplayText = document.querySelector('[data-prev-operation]')
const currDisplayText = document.querySelector('[data-curr-operation]')

// keypad buttons
const numbers = document.querySelectorAll('[data-number]')
const operations = document.querySelectorAll('[data-operation]')
const payments = document.querySelectorAll('[data-payment]')
const deleteBtn = document.querySelector('[data-delete]')
const voidBtn = document.querySelector('[data-void]')
const enterBtn = document.querySelector('[data-enter]')

// data summary entries
const copyBtn = document.querySelector('[data-copy-btn]')
const copyAreaClipboard = document.querySelector('[data-area-clipboard]')
const sumInitValue = document.querySelector('[data-init-value]')
const sumCoffeTotal = document.querySelector('[data-coffe-total]')
const sumBeerTotal = document.querySelector('[data-beer-total]')
const sumDrinkTotal = document.querySelector('[data-drink-total]')
const sumBurgerTotal = document.querySelector('[data-burger-total]')
const sumSandwichTotal= document.querySelector('[data-sandwich-total]')
const sumMoneyInTotal = document.querySelector('[data-money-in-total]')
const sumMoneyOutTotal = document.querySelector('[data-money-out-total]')
const sumVoidsTotal = document.querySelector('[data-voids-total]')
const sumPaymCashTotal = document.querySelector('[data-payment-cash-total]')
const sumPaymCheckTotal = document.querySelector('[data-payment-check-total]')
const sumPaymCardTotal = document.querySelector('[data-payment-card-total]')
const sumGrandTotal = document.querySelector('[data-grand-total]')

// entries html
const entriesCount = document.querySelector('[data-entries-count]')
const entriesHtml = document.querySelector('[data-entries]')

//---> SETUP TODAY'S DATE

const date = new Date().toLocaleDateString("en-GB", {year:"numeric", day:"2-digit", month:"2-digit"})
const dateElem = document.querySelector('[data-date]')
dateElem.innerText = date

//---> LOCALSTORAGE KEYS CONSTANTS

const LS_CASH_INIT_VALUE = 'register.cashInitValue'
const LS_REGISTER_ENTRIES = 'register.entriesData'
const LS_REGISTER_TIMESTAMP = 'register.timestamp'

// local storage data
let savedEntriesData = JSON.parse(localStorage.getItem(LS_REGISTER_ENTRIES)) || []
let initValue = localStorage.getItem(LS_CASH_INIT_VALUE) || 0

//---> FUNCTIONS

// open sidebar
function openSidebar() {
    sidebar.style.width = '250px';
}

// close sidebar
function closeSidebar() {
    sidebar.style.width = '0';
}

function saveEntriesData() {
    localStorage.setItem(LS_REGISTER_ENTRIES, JSON.stringify(savedEntriesData))
}

// save cash init value to localStorage
function saveCashInitValue(e) {
    e.preventDefault()

    if (initValue != 0) {
        alert('You have already registered the Initial Amount!')
        resetInput()
        closeSidebar()
        return
    }

    initValue = cashInitInput.value
    localStorage.setItem(LS_CASH_INIT_VALUE, initValue)
    localStorage.setItem(LS_REGISTER_TIMESTAMP, Date.now())

    resetInput()
    renderSummaryPane()
    closeSidebar()
}

// reset input on form submit
function resetInput() {
    cashInitInput.value = 0
}

// check for real data existance
function isRealObject(obj) {
    return obj && obj !== "null" && obj!== "undefined";
}

// copy summary text to clipboard
function copyToClipboard(elemtext) {
    const copyText = elemtext.innerText
    const textarea = document.createElement('textarea')

    document.body.appendChild(textarea)
    textarea.value = `REGISTER SUMMARY\n${date}\n\n${copyText}`
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('Register Summary copied to clipboard!')
}

// render entries template
function renderTemplate(data) {
    const date = new Date(data.timestamp)
    const time = `${date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes()}`

    entriesHtml.insertAdjacentHTML('afterbegin', `
        <div class="entrie__section ${data.class} ${data.voidStatus && 'entrie__voidMode'}">
            <p>${data.transactionName} &raquo;&raquo; ${data.transactionValue}</p>
            <p>${data.tenderName} &raquo;&raquo; ${data.tenderValue}</p>
            <p>Change &raquo;&raquo; ${data.change}</p>
            <p>Time &raquo;&raquo; ${time}</p>
        </div>
    `)
}

// rounding accurately to n decimal places
function roundToTwoDecimals(n, d) {
    // where n = number, and d = decimal places
    return Number(Math.round(n + 'e' + d) + 'e-' + d)
}

// render summary pane
function renderSummaryPane() {

    sumInitValue.innerText = initValue == 0 ? '0.00' : initValue

    if (isRealObject(savedEntriesData)) {

        const coffeTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Coffe')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumCoffeTotal.innerText = coffeTotal != 0 ? coffeTotal : '0.00'

        const beerTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Beer')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumBeerTotal.innerText = beerTotal != 0 ? beerTotal : '0.00'

        const drinkTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Drink')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumDrinkTotal.innerText = drinkTotal != 0 ? drinkTotal : '0.00'

        const burgerTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Burger')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumBurgerTotal.innerText = burgerTotal != 0 ? burgerTotal : '0.00'

        const sandwichTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Sandwich')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumSandwichTotal.innerText = sandwichTotal != 0 ? sandwichTotal : '0.00'

        const moneyInTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Money-In')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumMoneyInTotal.innerText = moneyInTotal != 0 ? moneyInTotal : '0.00'

        const moneyOutTotal = roundToTwoDecimals(savedEntriesData.map(({transactionName: name, transactionValue: value}) => ({name, value}))
            .filter(e => e.name == 'Money-Out')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumMoneyOutTotal.innerText = moneyOutTotal != 0 ? moneyOutTotal : '0.00'

        const voidsTotal = roundToTwoDecimals(savedEntriesData.map(({voidAmount}) => ({voidAmount}))
            .reduce((a,cv) => a + parseFloat(cv.voidAmount), 0), 2)
        sumVoidsTotal.innerText = voidsTotal != 0 ? voidsTotal : '0.00'

        const paymCashTotal = roundToTwoDecimals(savedEntriesData.map(({tenderName: name, tenderAmountIn: value}) => ({name, value}))
            .filter(e => e.name == 'Cash')
            .reduce((a,cv) => a + parseFloat(cv.value), 0)  + parseFloat(initValue), 2)
        sumPaymCashTotal.innerText = paymCashTotal != 0 ? paymCashTotal : '0.00'

        const paymCheckTotal = roundToTwoDecimals(savedEntriesData.map(({tenderName: name, tenderAmountIn: value}) => ({name, value}))
            .filter(e => e.name == 'Check')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumPaymCheckTotal.innerText = paymCheckTotal != 0 ? paymCheckTotal : '0.00'

        const paymCardTotal = roundToTwoDecimals(savedEntriesData.map(({tenderName: name, tenderAmountIn: value}) => ({name, value}))
            .filter(e => e.name == 'Card')
            .reduce((a,cv) => a + parseFloat(cv.value), 0), 2)
        sumPaymCardTotal.innerText = paymCardTotal != 0 ? paymCardTotal : '0.00'
        
        const grandTotal = roundToTwoDecimals(savedEntriesData.map(({transactionValue}) => ({transactionValue}))
            .reduce((a,cv) => a + parseFloat(cv.transactionValue) , 0) + parseFloat(initValue), 2)
        sumGrandTotal.innerText = grandTotal != 0 ? grandTotal : '0.00'

        entriesCount.innerText = savedEntriesData.length

    } else {
        sumCoffeTotal.innerText = '0.00'
        sumBeerTotal.innerText = '0.00'
        sumDrinkTotal.innerText = '0.00'
        sumBurgerTotal.innerText = '0.00'
        sumMoneyInTotal.innerText = '0.00'
        sumMoneyOutTotal.innerText = '0.00'
        sumSandwichTotal.innerText = '0.00'
        sumVoidsTotal.innerText = '0.00'
        sumPaymCashTotal.innerText = initValue == 0 ? '0.00' : initValue
        sumPaymCheckTotal.innerText = '0.00'
        sumPaymCardTotal.innerText = '0.00'
        sumGrandTotal.innerText = initValue == 0 ? '0.00' : initValue
        entriesCount.innerText = '0'
    }
}

// render entries pane
function renderEntriesPane() {

    if (isRealObject(savedEntriesData)) {

        // reset entriesHtml before update
        entriesHtml.innerHTML = ''

        savedEntriesData.sort((a,b) => a.timestamp > b.timestamp).forEach(e => {
            const data = {
                timestamp: e.timestamp,
                class: e.class,
                transactionName: e.transactionName,
                transactionValue: e.transactionValue,
                tenderName: e.tenderName,
                tenderValue: e.tenderValue,
                change: e.change,
                voidStatus: e.voidStatus
            }
            renderTemplate(data)
        })
    } else {
        // reset entriesHtml anyway
        entriesHtml.innerHTML = ''
    }
}

//---> CASH INIT FORM LISTENERS

cashInitInput.addEventListener('input', () => {
    cashInitInput.value = cashInitInput.value.replace(/[^.\d]/g, '')
    .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
})

submitBtn.addEventListener('click', saveCashInitValue)

amendBtn.addEventListener('click', (e) => {
    e.preventDefault()

    if (initValue == 0) {
        alert('Nothing to modify, you must first register the Initial Amount!')
        closeSidebar()
        return
    }

    alert('The Initial Amount has been eliminated, you can now enter a new value!')
    initValue = 0
    localStorage.removeItem(LS_CASH_INIT_VALUE)
    renderSummaryPane()
})

resetRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (savedEntriesData.length < 1) {
        alert('Nothing to delete!')
        closeSidebar()
        return
    }

    if (confirm('All data entered will be deleted. Are you sure you want to proceed with this operation?')) {
        savedEntriesData = []
        localStorage.removeItem(LS_CASH_INIT_VALUE)
        localStorage.removeItem(LS_REGISTER_ENTRIES)
        localStorage.removeItem(LS_REGISTER_TIMESTAMP)
    }
    // reset entriesHtml
    renderSummaryPane()
    renderEntriesPane()
    closeSidebar()
})

openBtn.addEventListener('click', openSidebar)

closeBtn.addEventListener('click', closeSidebar)

copyBtn.addEventListener('click', () => {
    copyToClipboard(copyAreaClipboard)
})

//---> REGISTER CLASS

class Register {
    constructor(prevDisplayText, currDisplayText) {
        this.prevDisplayText = prevDisplayText
        this.currDisplayText = currDisplayText
        this.allClear()
    }

    allClear() {
        this.prevDisplayText.removeAttribute('data-before')
        this.prevDisplayText.innerText = ''
        this.currDisplayText.removeAttribute('data-before')
        this.currDisplayText.innerText = ''
        this.transaction = ''
        this.payment = ''
        this.entry = ''
        this.entryTran = ''
        this.entryPaym = ''
        this.tempEntry = ''
        this.className = ''
        this.currentEntry = ''
        this.operation = undefined
        this.change = ''
        this.voidMode = false
        this.voidModeAmount = ''
    }

    delete() {
        this.currentEntry = this.currentEntry.toString().slice(0, -1)
    }

    appendNumber(number) {
        if (number === '.' && this.currentEntry.includes('.')) return
        this.currentEntry = this.currentEntry.toString() + number.toString()
        // console.log('currentEntry >>>', this.currentEntry)
    }

    enableEnter() {
        enterBtn.removeAttribute('disabled')
        this.disableAllButEnter()
    }

    disableEnter() {
        enterBtn.setAttribute('disabled', 'disabled')
    }

    disableAllButEnter() {
        numbers.forEach(e => e.setAttribute('disabled', 'disabled'))
        operations.forEach(e => e.setAttribute('disabled', 'disabled'))
        payments.forEach(e => e.setAttribute('disabled', 'disabled'))
        deleteBtn.setAttribute('disabled', 'disabled')
        voidBtn.setAttribute('disabled', 'disabled')
    }

    enablePayments() {
        payments.forEach(e => e.removeAttribute('disabled'))
    }

    enableAllButEnter() {
        numbers.forEach(e => e.removeAttribute('disabled'))
        operations.forEach(e => e.removeAttribute('disabled'))
        deleteBtn.removeAttribute('disabled')
        voidBtn.removeAttribute('disabled')
    }

    resetBtShowHide() {
        restartBtn.classList.toggle('hidden')
    }

    resetScreen() {
        this.allClear()
        this.enableAllButEnter()
        this.resetBtShowHide()
        this.removeVoidMode()
    }

    cancelBtShowHide() {
        cancelBtn.classList.toggle('hidden')
    }

    cancelOperation() {
        this.allClear()
        this.enableAllButEnter()
        this.cancelBtShowHide()
        this.removeVoidMode()
    }

    removeVoidMode() {
        displayVoidMode.classList.remove('voidMode')
        voidBtn.classList.remove('voidBtnOn')
    }

    voidTransaction() {
        if (this.voidMode) {
            this.voidMode = false
            this.removeVoidMode()
            // console.log('void >>>', this.voidMode)
        } else {
            this.voidMode = true
            displayVoidMode.classList.add('voidMode')
            voidBtn.classList.add('voidBtnOn')
            // console.log('void >>>', this.voidMode)
        }
    }

    chooseOperation(type, entry, className) {
        if (this.currentEntry === '') return

        this.operation = type
        this.entry = entry

        if (this.operation === 'tp') {
            this.transaction = this.voidMode ? `-${this.currentEntry}` : this.currentEntry
            this.entryTran = entry
            this.className = className
            this.voidModeAmount = this.voidMode ? this.currentEntry : 0
            this.enablePayments()
        } else if (this.operation === 'tn') {
            this.transaction = this.voidMode ? this.currentEntry : `-${this.currentEntry}`
            this.payment = 0
            this.entryTran = entry
            this.entryPaym = 'Cash'
            this.tempEntry = 'Cash'
            this.currentEntry = this.payment
            this.className = className
            this.voidModeAmount = this.currentEntry ? this.transaction : 0
            this.updateDisplay()
            this.enableEnter()
            this.cancelBtShowHide()
            return
        } else {
            this.payment = this.voidMode ? `-${this.currentEntry}` : this.currentEntry
            this.entryPaym = entry
            if (parseFloat(this.payment) < parseFloat(this.transaction)) {
                this.operation = 'tp'
                this.currentEntry = ''
                this.payment = ''
                this.entryPaym = ''
                alert(`The Payment Method cannot be less than the transaction, try again!`)
                this.updateDisplay()
                return
            }
            this.enableEnter()
            this.cancelBtShowHide()
        }
        
        this.currentEntry = ''
    }
    
    entriesData() {
        const data = {
            timestamp: Date.now(),
            class: this.className,
            transactionName: this.entryTran,
            transactionValue: this.transaction,
            tenderName: this.entryPaym,
            tenderValue: this.payment,
            tenderAmountIn: this.transaction,
            voidStatus: this.voidMode,
            voidAmount: this.voidModeAmount,
            change: this.change
        }

        savedEntriesData.push(data)
        // console.log('savedEntriesData', savedEntriesData)

        // save data to local storage
        saveEntriesData()
        // only render the current entry object
        renderTemplate(data)
        // this renders the whole localStorage object. now it'd done on page reload
        //renderEntriesPane()
    }

    roundAccurately(n, d) {
        // where n = number, and d = decimal places
        return Number(Math.round(n + 'e' + d) + 'e-' + d)
    }

    compute() {
        const tran = parseFloat(this.transaction)
        const paym = parseFloat(this.payment)
        if (isNaN(tran) || isNaN(paym)) return
        this.change = this.operation === 'tn' ? this.roundAccurately(Math.abs(tran), 2) : this.roundAccurately((paym - tran), 2)
        // this.operation = undefined
        // this.transaction = ''
        // this.payment = ''
        // this.currentEntry = ''
    }

    formatNumber(number) {
        const stringNum = number.toString()
        const intDigits = parseFloat(stringNum.split('.')[0])
        const decimalDigits = stringNum.split('.')[1]
        let intDisplay
        if (isNaN(intDigits)) {
            intDisplay = ''
        } else {
            intDisplay = intDigits.toLocaleString('en-GB', {
                maximumFractionDigits: 0
            })
        }
        if (decimalDigits != null) {
            return `${intDisplay}.${decimalDigits}`
        } else {
            return intDisplay
        }
    }

    updateDisplay() {
        this.currDisplayText.innerText = this.formatNumber(this.currentEntry)
        switch(this.operation) {
            case 'tp': 
                this.prevDisplayText.innerText = this.formatNumber(this.transaction)
                this.prevDisplayText.setAttribute('data-before', this.entry)
                break
            case 'tn': 
                this.prevDisplayText.innerText = this.formatNumber(this.transaction)
                this.prevDisplayText.setAttribute('data-before', this.entry)
                this.currDisplayText.innerText = this.formatNumber(this.payment)
                this.currDisplayText.setAttribute('data-before', this.tempEntry)
                break
            case 'pm': 
                this.prevDisplayText.innerText = this.formatNumber(this.transaction)
                this.prevDisplayText.setAttribute('data-before', this.entryTran)
                this.currDisplayText.innerText = this.formatNumber(this.payment)
                this.currDisplayText.setAttribute('data-before', this.entryPaym)
                break
            default:
                this.prevDisplayText.innerText = ''
        }
    }

    updateDisplayFinal() {
        this.compute()
        if (this.change === '') return
        this.prevDisplayText.innerText = ''
        this.prevDisplayText.removeAttribute('data-before')
        this.currDisplayText.innerText = `£ ${this.formatNumber(this.change)}`
        this.currDisplayText.setAttribute('data-before', 'CHANGE')
        this.entriesData()
        this.resetBtShowHide()
        this.cancelBtShowHide()
        this.disableEnter()
        // console.log('operation >>>', this.operation)
        // console.log('transaction >>>', this.transaction)
        // console.log('transaction entry >>>', this.entryTran)
        // console.log('payment >>>', this.payment)
        // console.log('payment entry >>>', this.entryPaym)
        // console.log('change >>>', this.change)
        // console.log('class >>>', this.className)
        // console.log('void >>>', this.voidMode)
    }
}

//---> SETUP REGISTER

const register = new Register(prevDisplayText, currDisplayText)

//---> REGISTER LISTENERS

numbers.forEach(number => {
    number.addEventListener('click', () => {
        register.appendNumber(number.innerText)
        register.updateDisplay()
    })
})

deleteBtn.addEventListener('click', () => {
    register.delete()
    register.updateDisplay()
})

operations.forEach(operation => {
    operation.addEventListener('click', () => {
        register.chooseOperation(operation.dataset.operation, operation.dataset.entry, operation.dataset.class)
        register.updateDisplay()
    })
})

payments.forEach(payment => {
    payment.addEventListener('click', () => {
        register.chooseOperation(payment.dataset.payment, payment.dataset.entry, '')
        register.updateDisplay()
    })
})

voidBtn.addEventListener('click', () => {
    register.voidTransaction()
})

enterBtn.addEventListener('click', () => {
    register.updateDisplayFinal()
    renderSummaryPane()
    // renderEntriesPane()
})

restartBtn.addEventListener('click', () => {
    register.resetScreen()
})

cancelBtn.addEventListener('click', () => {
    register.cancelOperation()
})

//---> ToDo
// const numbersKeysAndDot = [48,96,49,97,50,98,51,99,52,100,53,101,54,102,55,103,56,104,57,105,110,190]
// const deleteKeys = [8,46]
// const escapeKey = 27
// const enterKey = 13

// if (initValue != 0) {
//     document.addEventListener('keydown', e => {
//         console.log(e)
//         e.preventDefault();
//         if (numbersKeysAndDot.indexOf(e.keyCode) >= 0) {
//             register.appendNumber(e.key)
//             register.updateDisplay()
//         } else if (deleteKeys.indexOf(e.keyCode) >= 0) {
//             register.delete()
//             register.updateDisplay()
//         } else if (escapeKey === e.keyCode) {
//             register.allClear()
//         } else if (enterKey === e.keyCode) {
//             register.updateDisplayFinal()
//         }  else {
//             return false;
//         }
//     })
// }

//---> LOAD SAVED DATA ON REFRESH

if (savedEntriesData.length > 0) {
    renderSummaryPane()
    renderEntriesPane()
}

// Todo : 
// 1. disable payment methods before a transaction is set Tip: separate them into their own event listenes ***DONE***
// 2. finish implementing the void mode ***DONE***
// 3. add cancel/reset functionality after void is pressed and after payment is set but before enter is pressed ***DONE***
// 4. render the sumary list on the fly and not from local storage during a live session ***DONE***
// 5. enable toggle keboard keystrokes when cash init is set Tip: use isSavedInitValue to toggle the function
// 6. prevent register entries if entries from the previous day haven't been reset
// 7. convert the app to a PWA
