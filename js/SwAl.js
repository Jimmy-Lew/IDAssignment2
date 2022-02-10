// #region SwAl parent structure
const delay = (timeInMilli) =>
    new Promise((resolve, reject) => {
        setTimeout((_) => resolve(), timeInMilli);
    });

async function swal(options, refreshTime, isReverseDefault = false, userInput = "",) {
    const swalCont = $("#swal-container");
    const modalObj = `<div class="swal-modal"></div>`;
    const contentObj = `<div class="swal-content"></div>`;
    const subTextObj = `<br><br><span class="swal-sub">${options.subtext || ''}</span>`;
    const buttonContObj = `<div class="swal-button-container"></div>`;
    const inputObj = `<input class="swal-input" value="${userInput}" readonly autofocus></input>`;

    // #region SwAl StyleSheets
    const docHeight = document.documentElement.scrollHeight;
    const alertHeight = Math.ceil(docHeight * 0.92);
    const alertWidth = Math.ceil(alertHeight * (8 / 9));

    const width = options.width || alertWidth;
    const height = options.height || alertHeight;
    const bg = options.background || `url("../Assets/images/pngs/FrameDesign1.png")`;
    const textCol = options.textColor || "#fff";

    const buttons = options.buttons || [true, false];

    const modalStyle = {
        width: `${width}px`,
        height: `${height}px`,
        background: bg,
        "background-size": "cover",
        color: textCol,
    };

    const contentStyle = {
        "font-size": `${height * 0.047}px`,
        width: `${width * 0.75}px`,
        margin: "auto",
        background: "#000",
        position: "relative",
        top: `${height * 0.12}px`
    };

    const buttonContStyle = {
        display: "flex",
        "justify-content": "center",
        position: "relative",
        top: `${height * 0.75}px`,
        height: `${height * 0.038}px`,
        "background-color": "rgba(255, 255, 255, 0.0)"
    };

    const buttonStyle = {
        display: "inline-table",
        margin: `0 ${width * 0.1}px`,
        "font-size": `${height * 0.038}px`,
    };

    const inputStyle = {
        "text-align": "center",
        color: textCol,
        "font-size": `${height * 0.038}px`,
        width: "100%",
        margin: "0 auto",
        border: "none",
        "background-color": "#000",
        position: "relative",
        top: `${height * 0.46}px`,
        cursor: `url("../Assets/images/pngs/Cursor.png"), auto`
    };

    const imgStyle = {
        width: `${docHeight * 0.419}px`,
        height: `${docHeight * 0.419}px`
    }

    const subtTextStyle = {
        "font-size": `${height * 0.032}px`
    }
    // #endregion

    swalCont.append(modalObj);
    swalCont.css("display", "flex");

    let modal = $(".swal-modal");

    modal.append(buttonContObj);
    modal.append(inputObj);
    modal.append(contentObj);

    let content = $(".swal-content");
    let input = $(".swal-input");
    let buttonCont = $(".swal-button-container");

    if (options.input)
        input.attr({
            placeholder: "Type here!",
            readonly: false,
        });

    buttonCont.css(buttonContStyle);

    for (let i = 0; i < buttons.length; i++) {
        buttonCont.append(
            `<div class="swal-button ${i}"></div>`
        );
        if (buttons[i] === true)
            $(`.swal-button.${i}`).text("Yes").css(buttonStyle);
        else if (buttons[i] === false)
            $(`.swal-button.${i}`).text("No").css(buttonStyle);
        else $(`.swal-button.${i}`).text(buttons[i]).css(buttonStyle);
    }

    input.css(inputStyle);

    content.html(options.content).css(contentStyle);
    content.append(subTextObj)
    $(".swal-sub").css(subtTextStyle);
    $(".swal-gallery").css(imgStyle);
    modal.css(modalStyle);

    let returnVal = null;

    // #region Event listeners & handlers
    $(".swal-button").on("click", function () {
        returnVal = buttons[parseInt($(this).attr("class").slice(-1))];
    });

    input.on("keyup", function (e) {
        if (e.key === "Enter") {
            $(this).attr("readonly", true);
            returnVal = $(this).val();
        }
    });

    $(document).on("keyup", function (e) {
        if (e.key === "Enter") {
            if (buttons.length > 0) {
                if (isReverseDefault){
                    returnVal = buttons[buttons.length - 1];
                }
                else {
                    returnVal = buttons[0];
                }
            }
        }
    })

    $(document).on("keyup", function (e) {
        if (e.key === "Escape") {
            returnVal = "Escape";
        }
    })
    // #endregion

    await delay(refreshTime);
    swalCont.empty();
    swalCont.hide();
    if (returnVal == null) return swal(options, refreshTime, isReverseDefault, input.val());
    console.log(returnVal);
    return returnVal;
}
// #endregion

// #region SwAl Templates
async function swalConfirm(text, subText = "", refreshTime = 1500){
    result = await swal(
        {
            content: text,
            subtext: subText
        },
        refreshTime
    );

    return result;
}

async function swalPrompt(text, subText = "", refreshTime = 8000){
    result = await swal(
        {
            content: text,
            buttons: [],
            input: true,
            subtext: subText
        },
        refreshTime
    );

    return result;
}

async function swalAlert(text, subText = "", refreshTime = 1500){
    result = await swal(
        {
            content: text,
            buttons: ["Ok"],
            subtext: subText
        },
        refreshTime
    );

    return result;
}

async function swalGallery(img = `<img src="Assets/images/pngs/placeholder.png" class="swal-gallery">`, isFirstOrLast = "", refreshTime = 1500){ // Limit Image size to 410px and then downscale
    if (isFirstOrLast === "First") buttons = ["Next"]
    if (isFirstOrLast === "") buttons = ["Previous","Next"]
    if (isFirstOrLast === "Last") buttons = ["Previous"]

    result = await swal(
        {
            content: img,
            buttons: buttons,
        },
        refreshTime,
        true
    );

    return result;
}
// #endregion