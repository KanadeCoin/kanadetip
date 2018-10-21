// v1.1.0

var KanadeTip = {};

KanadeTip.to = "";
KanadeTip.tokens = [];
KanadeTip.hidePoweredBy = false;

KanadeTip.messages = {};
KanadeTip.messages.plugin = "";
KanadeTip.messages.title = "";
KanadeTip.messages.mmMessage = "";
KanadeTip.messages.message = "";
KanadeTip.messages.ethAddrTitle = "Ethereum address";
KanadeTip.messages.thanks = "";
KanadeTip.messages.error = "";

KanadeTip.add = function(id, name, contractAddr, amount, symbol) {
    KanadeTip.tokens.push({
        id    : id,
        name  : name,
        addr  : contractAddr,
        amount: amount,
        symbol: symbol
    });
};

KanadeTip.generateViews = function(width) {
    var kanadeTipElem = document.getElementById("kanadeTip");
    if (typeof kanadeTipElem === 'undefined') { return; }

    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "kanadeTipWrapper");
    wrapper.style.cssText = "display:inline-block; margin:10px 0; padding:12px; width:300px; background-color:#fff; border:solid 2px #2d4472; border-radius:6px; width:"+width+"px; text-align:center; box-sizing:border-box;";
    kanadeTipElem.appendChild(wrapper);

    var wrapperTitle = document.createElement("div");
    wrapper.setAttribute("id", "kanadeTipTitle");
    wrapperTitle.innerHTML = KanadeTip.messages.title;
    wrapperTitle.style.cssText = "margin-bottom:8px; font-weight:bold; color:#2d4472;";
    wrapper.appendChild(wrapperTitle);

    var border = document.createElement("div");
    border.style.cssText = "margin-bottom:8px; width:100%; height: 2px; background-color:#2d4472;";
    wrapper.appendChild(border);

    var message = document.createElement("div");
    message.setAttribute("id", "kanadeTipMessage");
    message.innerHTML = KanadeTip.messages.message;
    message.style.cssText = "margin:4px 0; width:100%; font-weight:bold; font-size:10pt;";
    wrapper.appendChild(message);

    var ethaddrTitle = document.createElement("div");
    ethaddrTitle.setAttribute("id", "kanadeTipEthAddrTitle");
    ethaddrTitle.innerHTML = "Ethereum address";
    ethaddrTitle.style.cssText = "margin:4px 0; width:100%; font-size:10pt;";
    wrapper.appendChild(ethaddrTitle);

    var qrWrapper = document.createElement("div");
    qrWrapper.style.cssText = "width:100%; text-align:center;";
    wrapper.appendChild(qrWrapper);

    var qr = document.createElement("div");
    qr.setAttribute("id", "kanadeTipQR");
    qrWrapper.style.cssText = "width:200px; display:inline-block;";
    qrWrapper.appendChild(qr);

    var qrCode = new QRCode(document.getElementById("kanadeTipQR"), {
        text  : KanadeTip.to,
        width : 320,
        height: 320,
        colorDark  : "#2d4472",
        colorLight : "#ffffff",
    });

    var qrImg = document.getElementById("kanadeTipQR").getElementsByTagName("img").item(0);
    qrImg.style.cssText = "padding:10px; width:200px; height:200px; background-color:#fff; border:solid 10px #2d4472; box-sizing:border-box;";

    var ethaddrText = document.createElement("div");
    ethaddrText.setAttribute("id", "kanadeTipEthAddr");
    ethaddrText.innerHTML = KanadeTip.to;
    ethaddrText.style.cssText = "margin:2px 0; font-size:7pt; word-wrap:break-word; white-space:normal; word-break:break-word;";
    wrapper.appendChild(ethaddrText);

    if (typeof window.web3 !== 'undefined') {
        var border = document.createElement("div");
        border.style.cssText = "margin:16px 0 8px 0; width:100%; height: 2px; background-color:#2d4472;";
        wrapper.appendChild(border);

        var mmMessage = document.createElement("div");
        mmMessage.setAttribute("id", "kanadeTipMMMessage");
        mmMessage.innerHTML = KanadeTip.messages.mmMessage;
        mmMessage.style.cssText = "margin:4px 0; width:100%; font-weight:bold; font-size:10pt;";
        wrapper.appendChild(mmMessage);

        for (var i = 0; i < KanadeTip.tokens.length; i++) {
            var button = document.createElement("button");
            button.setAttribute("class", "kanadeTipButton");
            button.setAttribute("onclick", "KanadeTip.tip("+KanadeTip.tokens[i].id+")");
            button.innerHTML = "<nobr>"+KanadeTip.tokens[i].name + "</nobr> <nobr>("+KanadeTip.tokens[i].amount+" "+KanadeTip.tokens[i].symbol+")</nobr>";
            button.style.cssText = "margin:4px 0; padding:10px 4px; width:100%; font-weight:bold; border:solid 0 #f44; border-radius:6px; font-size:12pt; background-color:#2d4472; color: #fff";
            wrapper.appendChild(button);
        }
    }

    if (!KanadeTip.hidePoweredBy) {
        var linkWrapper = document.createElement("div");
        linkWrapper.style.cssText = "width:100%; text-align:right;";
        wrapper.appendChild(linkWrapper);

        var link = document.createElement("a");
        link.setAttribute("id", "kanadeTipCopyright");
        link.setAttribute("href", "https://kanadecoin.com/");
        link.setAttribute("rel", "nofollow");
        link.setAttribute("target", "_blank");
        link.innerHTML = "Powered by KanadeCoin";
        link.style.cssText = "color:#aaa; font-size:12px;";
        linkWrapper.appendChild(link);
    }
};

KanadeTip.tip = function(id) {
    var contractAddr, to, amount = null;
    for (var i = 0; i < KanadeTip.tokens.length; i++) {
        if (KanadeTip.tokens[i].id === id) {
            contractAddr = KanadeTip.tokens[i].addr;
            to = KanadeTip.to;
            amount = KanadeTip.tokens[i].amount;
        }
    }
    if (contractAddr === null || to === null || amount === null) {
        alert(KanadeTip.messages.error);
        return;
    }

    Kanade.contractAddress = contractAddr;
    Kanade.ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

    Kanade.connect(null, function(resultCode) {
        if (resultCode != Kanade.resultCode.Success) {
            alert(KanadeTip.messages.error);
            return;
        }

        var decimalsAmount = amount * Math.pow(10, Kanade.decimals);
        Kanade.transfer(to, decimalsAmount, function(resultCode, txHash) {
            if (resultCode == Kanade.resultCode.Success) {
                alert(KanadeTip.messages.thanks + "\nTX : " + txHash);
            } else {
                alert(KanadeTip.messages.error);
            }
        });
    });
};
