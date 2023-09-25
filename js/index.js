const pickTextColorBasedOnBgColorAdvanced = (bgColor, lightColor, darkColor) => {
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor,
    r = parseInt(color.substring(0, 2), 16),
    g = parseInt(color.substring(2, 4), 16),
    b = parseInt(color.substring(4, 6), 16),
    uicolors = [r / 255, g / 255, b / 255],
    c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
}

const randomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomBackgroundColor = Math.random().toString(16).slice(-6),
randomColor = pickTextColorBasedOnBgColorAdvanced(randomBackgroundColor, `#FFFFFF`, `#000000`),
randomButtons = document.querySelectorAll(".random-button"),
randomStartButton = document.querySelector(".random-start"),
randomEditButton = document.querySelector(".random-edit"),
randomEditBoxWrap = document.querySelector(".random-edit-box-wrap"),
randomText = document.querySelector(".random-circle-text"),
inputBox = document.querySelector(".random-edit-box-nickname"),
tableElement = document.querySelector(".customTable"),
jackPotAudio = new Audio("./js/sf.mp3")

let randomList = [],
tableTr = document.querySelectorAll(".table-number")
isEditBoxOpened = false

jackPotAudio.volume = 0.2

const removeRow = (e) => {
    const row = e.parentNode.parentNode;

    row.parentNode.removeChild(row);

    tableTr = document.querySelectorAll(".table-number")
    tableTr.forEach((e, i) => {
        e.innerText = i + 1
    })
}

document.documentElement.style.setProperty("--button-background-color", `#${randomBackgroundColor}`);
document.documentElement.style.setProperty("--button-color", `${randomColor}`);

randomStartButton.addEventListener("click", function() {
    if (tableTr.length === 0) {
        alert(`당첨될 사람이 없어요... '수정' 버튼을 클릭해서 사람들을 추가해 주세요.`)
        return
    }

    jackPotAudio.play()

    const randomIndex = Math.floor(Math.random() * tableTr.length);
    const randomItem = tableTr[randomIndex];

    randomText.innerText = `${Number(randomItem.innerText)}`
    randomText.style.filter = `blur(47px)`
    
    setTimeout(() => {
        randomText.style.filter = `blur(0px)`
    }, 2500);
})

randomEditButton.addEventListener("click", function() {
    if (isEditBoxOpened) {
        randomEditBoxWrap.style.display = `none`
        isEditBoxOpened = false
    } else {
        randomEditBoxWrap.style.display = `block`
        inputBox.focus()
        isEditBoxOpened = true
    }
})

window.onkeydown = (e) => {
    if (e.key === "Escape" && isEditBoxOpened) {
        randomEditBoxWrap.style.display = `none`
        isEditBoxOpened = false
    } else if ((e.key === "e" || e.key === "E") && !isEditBoxOpened) {
        randomEditBoxWrap.style.display = `block`
        isEditBoxOpened = true
    }
}

randomText.addEventListener("click", function(e) {
    const targetElement = e.target

    if (targetElement.style.filter === `blur(47px)`) {
        targetElement.style.filter = `blur(0px)`
    } else {
        targetElement.style.filter = `blur(47px)`
    }
})

inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const inputValue = e.target.value

        if (inputValue === '') {
            alert(`공백은 허용되지 않습니다.`)
            return
        }

        for (const str of randomList) {
            if (inputValue === str.nickname) {
                alert(`중복되는 닉네임입니다.`)
                return
            }
        }

        const newRow = tableElement.insertRow(),
        newCell1 = newRow.insertCell(0),
        newCell2 = newRow.insertCell(1),
        newCell3 = newRow.insertCell(2)

        newRow.classList.add(`table-number-${randomList.length + 1}`)
        newRow.rownumber = randomList.length

        newCell1.innerHTML = 0
        newCell1.classList.add(`table-number`)
        newCell2.innerHTML = inputValue
        newCell3.innerHTML = `<i class="fa-solid fa-trash-can trashcan-${randomList.length + 1}" onclick="removeRow(this)"></i>`

        tableTr = document.querySelectorAll(".table-number")
        tableTr.forEach((e, i) => {
            e.innerText = i + 1
        })

        e.target.value = ''
    }
})
