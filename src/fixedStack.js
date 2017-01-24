/**
 *
 * @param {Array} (fixed: 固定元素id, selector: 背景绑定元素id, background: 背景颜色) 固定元素配置数组
 * @param {int} z-index值
 * @param {int} 固定元素距离顶端保留距离
 */

let fixedStack = (function(cfg, zIndex, marginTop) {
    zIndex = (typeof zIndex !== 'undefined') ?  zIndex : 10;
    marginTop = (typeof marginTop !== 'undefined') ?  marginTop : 0;
    let defaultBackgroundColor = '#FFFFFF';
    if (!Array.isArray(cfg) || !cfg.length) {
        return ;
    }
    if (!$(cfg[0].fixed).length || !$(cfg[0].selector).length) {
        return ;
    }
    // 获取元素距离页面顶端距离
    let getElementTop = function(element){
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== null){
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    };
    // 滚动事件回调
    let onScroll = function() {
        let scrollY = $(window).scrollTop();
        if (scrollY > elementTop - marginTop) {
            $(cfg[0].fixed).css({top: marginTop}).css("position", "fixed");
            backgroundDiv.css({top: marginTop, display: 'block'});
            if (!fixedStatus) {
                $(cfg[0].selector).css('padding-top', '+=' + elementHeight + 'px');
                $(cfg[0].fixed).css('width', elementWidth);
                fixedStatus = true;
            }
        } else {
            $(cfg[0].fixed).css("position", "static");
            backgroundDiv.css('display', 'none');
            if (fixedStatus) {
                $(cfg[0].selector).css('padding-top', '-=' + elementHeight + 'px');
                $(cfg[0].fixed).css('width', 'auto');
                fixedStatus = false;
            }
        }
    };
    let elementTop = getElementTop($(cfg[0].fixed)[0]);
    let elementWidth = $(cfg[0].fixed).css('width');
    let elementHeight = $(cfg[0].fixed)[0].clientHeight + parseInt($(cfg[0].fixed).css('margin-top').replace('px', '')) + parseInt($(cfg[0].fixed).css('margin-bottom').replace('px', ''));
    $(cfg[0].fixed).css('z-index', zIndex);
    let fixedStatus = false;
    // 背景层
    let backgroundDiv = $('<div></div>');
    backgroundDiv.css({
        'height': elementHeight + 'px',
        'width': '100%',
        'position': 'fixed',
        'z-index': zIndex - 1,
        'display': 'none'
    });
    if ('background' in cfg[0]) {
        backgroundDiv.css('background', cfg[0]['background']);
    } else {
        backgroundDiv.css('background', defaultBackgroundColor);
    }
    backgroundDiv.appendTo($(cfg[0].selector));
    if (cfg.length > 1) {
        fixedStack(cfg.slice(1), zIndex, marginTop + elementHeight);
    }
    $(window).scroll(onScroll);
});