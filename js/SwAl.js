// #region SwAl parent structure
const delay = (timeInMilli) =>
    new Promise((resolve, reject) => {
        setTimeout((_) => resolve(), timeInMilli);
    });

async function swal(options, refreshTime, userInput = "") {
    // #region SwAl Elements
    const swalCont = $("#swal-container");
    const modalObj = `<div class="swal-modal"></div>`;
    const contentObj = `<div class="swal-content"></div>`;
    const subTextObj = `<span class="swal-sub">${options.subtext || ""}</span>`;
    const buttonContObj = `<div class="swal-button-container"></div>`;
    const inputObj = `<input class="swal-input" value="${userInput}" readonly autofocus></input>`;
    // #endregion

    // #region SwAl StyleSheets & Options
    // #region Options
    let isMobile = false;
    const docHeight = window.innerHeight;
    const docWidth = window.innerWidth;

    let alertHeight;
    let alertWidth;

    if (docHeight / docWidth > 1) isMobile = true;
    if (isMobile) {
        alertWidth = Math.ceil(docWidth * 0.92);
        alertHeight = Math.ceil(alertWidth * (9 / 8));
    } else {
        alertHeight = Math.ceil(docHeight * 0.92);
        alertWidth = Math.ceil(alertHeight * (8 / 9));
    }
    const width = options.width || alertWidth;
    const height = options.height || alertHeight;
    const frame =
        options.background || `url("Assets/images/pngs/FrameDesign1.png")`;
    const textCol = options.textColor || "#fff";

    const contentTextScale = options.textSize || 0.047;
    const subTextScale = options.subTextSize || 0.032;
    const contentStart = options.contentStart || 0.12;

    const buttons = options.buttons || [true, false];

    const hasEscape = options.escape || false;
    const hasInput = options.input || false;
    const takeLastButtonVal = options.reverse || false;

    // #endregion

    // #region StyleSheets
    const modalStyle = {
        width: `${width}px`,
        height: `${height}px`,
        background: frame,
        "background-size": "cover",
        color: textCol,
        "z-index": 999,
    };

    const contentStyle = {
        "font-size": `${height * contentTextScale}px`,
        width: `${width * 0.75}px`,
        margin: "auto",
        background: "#000",
        position: "relative",
        top: `${height * contentStart}px`,
    };

    const buttonContStyle = {
        display: "flex",
        "justify-content": "center",
        position: "relative",
        top: `${height * 0.75}px`,
        height: `${height * 0.038}px`,
        "background-color": "rgba(255, 255, 255, 0.0)",
        "z-index": "999",
    };

    const buttonStyle = {
        display: "inline-table",
        width: `${width * 0.25}px`,
        "font-size": `${height * 0.038}px`,
    };

    const inputStyle = {
        "text-align": "center",
        color: textCol,
        "font-size": `${height * 0.038}px`,
        width: "100%",
        margin: "0 auto",
        border: "none",
        // "background-color": "#000",
        position: "relative",
        top: `${height * 0.46}px`,
        cursor: `url("Assets/images/pngs/Cursor.png"), auto`,
    };

    const imgStyle = {
        width: isMobile ? `${docWidth * 0.5}px` : `${docHeight * 0.563}px`,
        height: isMobile ? `${docWidth * 0.5}px` : `${docHeight * 0.563}px`,
    };

    const subtTextStyle = {
        "font-size": `${height * subTextScale}px`,
    };
    // #endregion
    // #endregion

    // #region SwAl Element Creation
    swalCont.append(modalObj);

    let modal = $(".swal-modal");

    modal.append(buttonContObj).append(inputObj).append(contentObj);

    let content = $(".swal-content");
    let buttonCont = $(".swal-button-container");

    for (let i = 0; i < buttons.length; i++) {
        buttonCont.append(`<div class="swal-button ${i}"></div>`);
        if (buttons[i] === true) $(`.swal-button.${i}`).text("Yes");
        else if (buttons[i] === false) $(`.swal-button.${i}`).text("No");
        else $(`.swal-button.${i}`).text(buttons[i]);
    }

    content.html(options.content).append(subTextObj);

    let button = $(".swal-button");
    let input = $(".swal-input");
    let subtext = $(".swal-sub");
    let gallery = $(".swal-gallery");
    // #endregion

    // #region SwAl Element Styling
    swalCont.css("display", "flex");
    modal.css(modalStyle);
    buttonCont.css(buttonContStyle);
    input.css(inputStyle);
    content.css(contentStyle);
    subtext.css(subtTextStyle);
    gallery.css(imgStyle);

    if (hasInput) input.attr({ placeholder: "Type here!", readonly: false });

    button.each(function() {$(this).css(buttonStyle);});
    // #endregion

    // #region Event listeners & handlers
    let returnVal = null;
    let isTrigger = false;

    button.on("click", function () {
        const buttonNo = parseInt($(this).attr("class").slice(-1));
        returnVal = buttons[buttonNo];
    });

    input.on("keyup", function (e) {
        if (e.key === "Enter") {
            $(this).attr("readonly", true);
            returnVal = $(this).val();
            refreshTime = 100;
        }
    });

    $(document).on("keyup", function (e) {
        if (e.key === "Enter" && buttons.length > 0 && !isTrigger)
        {returnVal = onEnterVal(buttons, takeLastButtonVal); isTrigger = true;}
        if (e.key === "Escape" && !hasEscape && !isTrigger)
        {returnVal = "Escape"; isTrigger = true;}
    });
    // #endregion

    // #region Handle return and refresh
    await delay(refreshTime);
    swalCont.empty().hide();
    if (returnVal == null) return swal(options, refreshTime, input.val());
    return returnVal;
    // #endregion
}

async function onEnterVal(buttons, takeLastButtonVal) {
    if (takeLastButtonVal) return buttons[buttons.length - 1];
    return buttons[0];
}
// #endregion
// #region SwAl Templates
async function swalConfirm(text, subText = "", refreshTime = 200) {
    result = await swal(
        {
            content: text,
            textColor: "green",
            subtext: subText,
        },
        refreshTime
    );

    return result;
}
async function swalPrompt(text, subText = "", refreshTime = 6000) {
    result = await swal(
        {
            content: text,
            buttons: [],
            input: true,
            subtext: subText,
            escape: true,
        },
        refreshTime
    );

    return result;
}
async function swalAlert(text, subText = "", refreshTime = 200) {
    result = await swal(
        {
            content: text,
            buttons: ["Ok"],
            subtext: subText,
        },
        refreshTime
    );

    return result;
}
async function swalGallery(
    img = `<img src="Assets/images/pngs/placeholder.png" class="swal-gallery">`,
    isFirstOrLast = "",
    refreshTime = 200
) {
    if (isFirstOrLast === "First") buttons = [">"];
    if (isFirstOrLast === "") buttons = ["<", ">"];
    if (isFirstOrLast === "Last") buttons = ["X"];

    result = await swal(
        {
            content: img,
            buttons: buttons,
            reverse: true,
            background: `url("Assets/images/pngs/HelpFrame.png")`,
            contentStart: 0.06,
        },
        refreshTime
    );

    return result;
}
async function swalLeaderboard(
    text,
    subText = "",
    isFirstOrLast = "",
    refreshTime = 200
) {
    if (isFirstOrLast === "First") buttons = ["X"];
    if (isFirstOrLast === "") buttons = ["<", ">"];
    if (isFirstOrLast === "Last") buttons = ["X"];

    result = await swal(
        {
            content: text,
            subTextSize: 0.026,
            buttons: buttons,
            subtext: subText,
            background: `url("Assets/images/pngs/${$(
                "#Difficulty"
            ).text()}Frame.png")`,
            contentStart: 0.08,
        },
        refreshTime
    );

    return result;
}
// #endregion