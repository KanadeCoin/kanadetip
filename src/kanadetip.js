// v1.0.0

var KanadeTip = {};

KanadeTip.to = "";
KanadeTip.tokens = [];
KanadeTip.hidePoweredBy = false;

KanadeTip.messages = {};
KanadeTip.messages.plugin = "";
KanadeTip.messages.title = "";
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
    wrapper.style.cssText = "margin:10px 0; padding:12px; width:300px; border:solid 2px #2d4472; border-radius:6px; width:"+width+"px; text-align:center;";
    kanadeTipElem.appendChild(wrapper);

    var wrapperTitle = document.createElement("div");
    wrapper.setAttribute("id", "kanadeTipTitle");
    wrapperTitle.innerHTML = KanadeTip.messages.title;
    wrapperTitle.style.cssText = "margin-bottom:8px; font-weight:bold; color:#2d4472;";
    wrapper.appendChild(wrapperTitle);

    if (typeof window.web3 === 'undefined') {
        var message = document.createElement("div");
        message.setAttribute("id", "kanadeTipMessage");
        message.innerHTML = KanadeTip.messages.message;
        message.style.cssText = "margin:4px 0; width:100%; font-size:10pt; text-align:left;";
        wrapper.appendChild(message);

        var ethaddrText = document.createElement("div");
        ethaddrText.setAttribute("id", "kanadeTipEthAddrTitle");
        ethaddrText.innerHTML = "Ethereum address";
        ethaddrText.style.cssText = "margin:4px 0; width:100%; font-weight:bold; font-size:12pt; text-align:left;";
        wrapper.appendChild(ethaddrText);

        var ethaddrText = document.createElement("div");
        ethaddrText.setAttribute("id", "kanadeTipEthAddr");
        ethaddrText.innerHTML = KanadeTip.to;
        ethaddrText.style.cssText = "margin:4px 0; padding:4px; font-weight:bold; font-size:11pt; background-color:#f0f0f0; word-wrap:break-word; white-space:normal; word-break:break-word; text-align:left;";
        wrapper.appendChild(ethaddrText);
    } else {
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
        wrapper.setAttribute("id", "kanadeTipCopyright");
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
