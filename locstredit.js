lang = {};
lang['^ko'] = {
    title: '팩토리오 Locale 문자열 편집기',
    69: '줄<br>바꿈',
    70: '누락 부분<br>생성',
    71: '차이 부분<br>생성',
    72: '동일 부분<br>생성',
    73: '줄 번호<br>표기',
    74: '줄 번호<br>제거',
    75: '키 이름<br>떼기',
    76: '키 이름<br>붙이기',
    77: '현지화<br>병합',
    100: '원본',
    101: '현지화',
    102: '비교',
    900: 'msg: 900\n* 키 이름 떼기 * 실패.\n"비교" 영역에 줄 번호가 붙어있지 않은 것 같습니다. "줄 번호 표기"를 먼저 실행하십시오.\n\n문제 부분:\n\n',
    910: 'msg: 910\n* 키 이름 떼기 * 실패.\n"비교" 영역에 파싱할 것이 아무것도 없습니다.',
    920: 'msg: 920\n* 키 이름 붙이기 * 실패.\n"비교" 영역의 무언가가 잘못되었습니다. "키 이름 떼기"를 먼저 성공한 것이 맞습니까? 그렇다면 각 줄의 접두문자열을 유지해야 합니다. 의도하지 않은 문자가 있는지 확인하십시오.\n\n문제 부분:\n\n',
    930: 'msg: 930\n"비교" 영역의 텍스트가 변경되며 되돌릴 수 없습니다. 계속하시겠습니까?',
    940: 'msg: 940\n"비교" 영역이 비어있지 않습니다. 내용을 삭제하시겠습니까?',
    950: 'msg: 950\n"원본"과 "현지화"의 내용이 상충할 수 있습니다. "현지화"의 내용을 유지하겠습니까?',
    960: 'msg: 960\n회피하는 이모지가 처리되지 않았습니다. 잘못된 문장 편집이 있거나, "비교"가 "원본" 데이터의 매핑을 엄격하게 따르지 않아서 그런 것일 수 있습니다.\n\n문제 부분:\n\n',
    970: '\n\n또는 그 이전 라인.'
};
lang['^en'] = {
    title: 'Factorio Locale String Editor',
    69: 'word<br>wrap',
    70: 'generate<br>missing',
    71: 'generate<br>difference',
    72: 'generate<br>identical',
    73: 'tag line<br>number',
    74: 'untag line<br>number',
    75: 'detach<br>key names',
    76: 'attach<br>key names',
    77: 'merge with<br>localised',
    100: 'original',
    101: 'localised',
    102: 'compare',
    900: 'msg: 900\n* detach key names * FAILED.\nLine number seems not tagged at texts in "compare" section. Do "tag line number" first.\n\nProblem in:\n\n',
    910: 'msg: 910\n* detach key names * FAILED.\nThere is nothing to be parsed in "compare" section.',
    920: 'msg: 920\n* attach key names * FAILED.\nSomething wrong in "compare" section. Did you really do "detach key names" first successful? If so, preserve all prefixes of each line. Check for unintended characters.\n\nProblem in:\n\n',
    930: 'msg: 930\nTexts in "compare" section will be changed irreversible. Are you sure to continue?',
    940: 'msg: 940\n"compare" section is not empty. Do you really discard its contents?',
    950: 'msg: 950\nContents in "original" and "localised" can conflict. Do you want to keep content of "localised"?',
    960: 'msg: 960\nAvoiding emoji is not processed. There is possiblity that wrong sentence modification is applied or "compare" is not strictly following mapping of "original" data.\n\nProblem in:\n\n',
    970: '\n\nOr its previous line.'
};
dialmsg = Object.assign({}, lang['^en']);
window.onload = function(){
    var reg;
    for(var key in lang){
        reg = new RegExp(key, 'i');
        if(navigator.language.match(reg)){
            var doms = document.querySelectorAll('[data-langKey]');
            for(var i = 0; i < doms.length; i++){
                doms[i].innerHTML = lang[key][doms[i].dataset['langkey']]
            };
            dialmsg = Object.assign({}, lang[key]);
            break;
        }
    }
};

/***************************************************************************/

var editor_names = ['text_ori', 'text_loc', 'text_com'];

function ew(e){
    window.alert(e.name + '\n\n' + e.message + '\n\n' + e.stack + '\n');
    throw e;
}

function on_wswrap_changed(){try{
    var box = document.getElementById('wswrap');
    var ws = 'nowrap';
    if(box.checked){
        ws = 'normal';
    }
    for(var i = 0; i < editor_names.length; i++){
        var editor = document.getElementById(editor_names[i])
        editor.style.whiteSpace = ws;
    }
}catch(e){ew(e)}}

function parse(str, obj_oriarr){try{
    var arr = new Array();
    str = str.replace(/\u200B/g, '').replace(/\r\n/g, '\n');
    var spl = str.split('\n');
    var reg0 = /^[\u25C0\u25C1]\s?(\d+)\s?[\u25B6\u25B7]\s?(.*)$/;
    var reg1 = /^\[([a-zA-Z0-9\-_]+)\]\s*$/;
    var reg2 = /^([a-zA-Z0-9\-_]+)=(.*)$/;
    var m = null;
    var last_grp = '';
    var ecnt = 0;
    var grp_ecnt = 0;
    for(var i = 0; i < spl.length; i++){
        var t = spl[i];
        var n = (i+1) + '';
        m = t.match(reg0);
        if(m){
            n = m[1];
            t = m[2];
        }
        m = t.match(reg2);
        if(m){
            arr.push({num: n, key: m[1], text: m[2], group: last_grp, ebef: ecnt, grp_ebef: grp_ecnt});
            ecnt = 0;
        }
        else{
            m = t.match(reg1);
            if(m){
                last_grp = m[1];
                grp_ecnt = ecnt;
                arr.push({num: n, group: last_grp, ebef: ecnt, grp_ebef: ecnt});
                ecnt = 0;
            }
            else{
                arr.push({num: n, empty: t, ebef: ecnt});
                ecnt++;
            }
        }
        if(typeof(obj_oriarr) == 'object' && typeof(arr[arr.length-1].empty) != 'string'){
            var lastitem = arr[arr.length-1];
            var found = false;
            for(var j = 0; j < obj_oriarr.length; j++){
                if(obj_oriarr[j].key == lastitem.key && obj_oriarr[j].group == lastitem.group){
                    arr[arr.length-1].num = obj_oriarr[j].num;
                    arr[arr.length-1].grp_ebef = obj_oriarr[j].grp_ebef;
                    arr[arr.length-1].ebef = obj_oriarr[j].ebef;
                    found = true;
                    break;
                }
            }
            if(!found){
                arr[arr.length-1].num = 0;
                arr[arr.length-1].grp_ebef = 1;
                arr[arr.length-1].ebef = 0;
            }
        }
    }
    return arr;
}catch(e){ew(e)}}

function recompose(obj_arr, bool_tagnum){try{
    var str = '';
    for(var i = 0; i < obj_arr.length; i++){
        if(typeof(obj_arr[i].key) == 'string'){
            str = str + ((bool_tagnum)? '\u25C0'+obj_arr[i].num+'\u25B6' : '') + obj_arr[i].key + '=' + obj_arr[i].text + '\n';
        }
        else if(typeof(obj_arr[i].group) == 'string'){
            str = str + ((bool_tagnum)? '\u25C0'+obj_arr[i].num+'\u25B6' : '') + '[' + obj_arr[i].group + ']\n';
        }
        else if(typeof(obj_arr[i].empty) == 'string'){
            str = str + ((bool_tagnum)? '\u25C1'+obj_arr[i].num+'\u25B7' : '') + obj_arr[i].empty + '\n';
        }
    }
    if(str.length > 0){
        return str.slice(0, -1);
    }
    else{
        return str;
    }
}catch(e){ew(e)}}

function askcomp(){try{
    var com = document.getElementById('text_com');
    if(com.value != ''){
        var conf = window.confirm(dialmsg[940]);
        if(!conf){
            return false;
        }
    }
    return true;
}catch(e){ew(e)}}

function tagnumber(bool_tag_untag){try{
    var n = 0;
    var ori;
    for(var i = 0; i < editor_names.length; i++){
        var editor = document.getElementById(editor_names[i]);
        var arr;
        if(i > 0){
            arr = parse(editor.value, ori);
        }
        else{
            arr = parse(editor.value);
            ori = arr;
        }
        editor.value = recompose(arr, bool_tag_untag);
    }
}catch(e){ew(e)}}

function gencompare(work){try{
    var newstr = '';
    if(work == 'miss'){work = 1}
    else if(work == 'diff'){work = 2}
    else if(work == 'iden'){work = 3}
    else{work = 0}
    if(askcomp()){
        var keeploc = true;
        if(work == 2){
            keeploc = window.confirm(dialmsg[950]);
        }
        var ori = parse(document.getElementById('text_ori').value);
        var loc = parse(document.getElementById('text_loc').value, ori);
        var last_grp = '';
        var empty_before = '';
        for(var i = 0; i < ori.length; i++){
            if(typeof(ori[i].empty) == 'string' || typeof(ori[i].key) != 'string'){
                continue;
            }
            var found = false;
            for(var j = 0; j < loc.length; j++){
                if(
                    loc[j].num == ori[i].num
                    && typeof(loc[j].empty) != 'string'
                    && typeof(loc[j].key) == 'string'
                    && loc[j].key == ori[i].key
                    && loc[j].group == ori[i].group
                    && (
                        work == 1
                        || (work == 2 && loc[j].text != ori[i].text)
                        || (work == 3 && loc[j].text == ori[i].text)
                    )
                ){
                    if(work == 1){found = true}
                    else if(work == 2 || work == 3){
                        if(ori[i].group != last_grp){
                            last_grp = ori[i].group;
                            empty_before = Array(ori[i].grp_ebef).fill('\n').join('');
                            newstr = newstr + empty_before + '[' + last_grp + ']\n';
                        }
                        if(keeploc){
                            empty_before = Array(ori[i].ebef).fill('\n').join('');
                            newstr = newstr + empty_before + ori[i].key + '=' + loc[j].text + '\n';
                        }
                        else{
                            empty_before = Array(ori[i].ebef).fill('\n').join('');
                            newstr = newstr + empty_before + ori[i].key + '=' + ori[j].text + '\n';
                        }
                        
                    }
                    break;
                }
            }
            if(work == 1 && !found){
                if(ori[i].group != last_grp){
                    last_grp = ori[i].group;
                    empty_before = Array(ori[i].grp_ebef).fill('\n').join('');
                    newstr = newstr + empty_before + '[' + last_grp + ']\n';
                }
                empty_before = Array(ori[i].ebef).fill('\n').join('');
                newstr = newstr + empty_before + ori[i].key + '=' + ori[i].text + '\n';
            }
        }
        document.getElementById('text_com').value = recompose(parse(newstr), false);
    }
}catch(e){ew(e)}}

function matchSplitMix(str, reg){
    var m = str.match(reg)
    var valueBlockRaw = [];
    var tmp = str;
    var pos = 0;
    if(m){
        for(var i = 0; i < m.length; i++){
            pos = tmp.indexOf(m[i]);
            if(pos == 0){
                valueBlockRaw.push({m: true, t: m[i]});
                tmp = tmp.slice(m[i].length);
            }
            else if(pos > 0){
                valueBlockRaw.push({m: false, t: tmp.slice(0, pos)});
                tmp = tmp.slice(pos);
                valueBlockRaw.push({m: true, t: m[i]});
                tmp = tmp.slice(m[i].length);
            }
        }
        valueBlockRaw.push({m: false, t: tmp});
    }
    else{
        return [{m: false, t: str}];
    }
    return valueBlockRaw;
}

function valueParser(str){
    var valueBlock = [];
    const regs = [
        /__plural_for_parameter_\d+_\{.+?\}__/g, //plural
        /__([A-Z0-9]|_(?!_))+__\d+__([A-Za-z0-9\-]|_(?!_))+__/g, //prefixed1
        /__([A-Z0-9]|_(?!_))+__([A-Za-z0-9\-]|_(?!_))+__/g, //prefixed2
        /__\d+__/g, //number
        /\[[a-z\-]+=[^\]]+\]/g, //rich
        /\[\/[a-z]+\]/g, //rich bracket close
        /\\[abfnrtv\\"'\[\]]/g //lua escaping chars
    ]
    const lim = regs.length - 1;
    const recurBlockBuilder = function(str2, dim){
        let tmp = matchSplitMix(str2, regs[dim]);
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].m){
                valueBlock.push(tmp[i]);
            }
            else if(dim < lim){
                recurBlockBuilder(tmp[i].t, dim + 1);
            }
            else if(dim >= lim){
                valueBlock.push(tmp[i]);
            }
        }
    }
    recurBlockBuilder(str, 0);
    return valueBlock;
}

const emojiList = [
    '\u{1F42E}', '\u{1F42F}', '\u{1F431}', '\u{1F434}', '\u{1F435}', '\u{1F436}', '\u{1F437}',
    '\u{1F43A}', '\u{1F43D}', '\u{1F981}', '\u{1F984}', '\u{1F98A}', '\u{1F98C}', '\u{1F98D}',
    '\u{1F992}', '\u{1F993}', '\u{1F999}', '\u{1F99D}', '\u{1F9A7}', '\u{1F9AC}', '\u{1F9AE}',
    '\u{1F402}', '\u{1F403}', '\u{1F404}', '\u{1F405}', '\u{1F406}', '\u{1F408}', '\u{1F40E}',
    '\u{1F40F}', '\u{1F410}', '\u{1F411}', '\u{1F412}', '\u{1F415}', '\u{1F416}', '\u{1F417}',
    '\u{1F429}', '\u{1F42A}'
];
const emojiListLen = emojiList.length;
const emojiListTest = new RegExp('(' + emojiList.join('|') + '|\u{1F4EF})');
function getEmojiMap(valueBlockOfOriginal){
    var emojiMap = [];
    for(var i = 0; i < valueBlockOfOriginal.length; i++){
        if(valueBlockOfOriginal[i].m){
            if(valueBlockOfOriginal[i].t == '\\n'){
                continue;
            }
            var found = false;
            for(var j = 0; j < emojiMap.length; j++){
                if(emojiMap[j] == valueBlockOfOriginal[i].t){
                    found = true;
                    break;
                }
            }
            if(!found){
                emojiMap.push(valueBlockOfOriginal[i].t);
            }
        }
    }
    return emojiMap;
}
function toEmoji(valueBlockOfCompare, emojiMap){
    var str = '';
    for(var i = 0; i < valueBlockOfCompare.length; i++){
        if(valueBlockOfCompare[i].m){
            if(valueBlockOfCompare[i].t == '\\n'){
                str = str + '\n\u{1F4EF}\n';
                continue;
            }
            var found = false;
            for(var j = 0; j < emojiMap.length; j++){
                if(emojiMap[j] == valueBlockOfCompare[i].t){
                    found = true;
                    if(j < emojiListLen){
                        str = str + emojiList[j];
                    }
                    else{
                        str = str + valueBlockOfCompare[i].t;
                    }
                    break;
                }
            }
            if(!found){
                str = str + valueBlockOfCompare[i].t;
            }
        }
        else{
            str = str + valueBlockOfCompare[i].t;
        }
    }
    return str.replace(/\n+/g,'\n');
}
function fromEmoji(str, emojiMap){
    var reg;
    var len = emojiMap.length;
    var newstr = str;
    if(len > emojiListLen){
        len = emojiListLen;
    }
    newstr = newstr.replace(RegExp('\u{1F4EF}', 'g'), '\\n');
    for(var i = 0; i < len; i++){
        reg = new RegExp(emojiList[i], 'g');
        newstr = newstr.replace(reg, emojiMap[i]);
    }
    return newstr;
}

function detachkey(){try{
    var dom_com = document.getElementById('text_com');
    var str = dom_com.value.replace(/\u200B/g, '').replace(/\r\n/g, '\n').replace(/(\n)+/g, '\n');
    var spl = str.split('\n');
    var reg = /^([\u25C0\u25C1])\s?(\d+)\s?([\u25B6\u25B7])\s?.*$/;
    var m = null;
    var met_normal = false;
    for(var i = 0; i < spl.length; i++){
        var t = spl[i];
        m = t.match(reg);
        if(m){
            if(m[1] == '\u25C0' && parseInt(m[2]) > 0 && m[3] == '\u25B6'){
                met_normal = true;
            }
        }
        else{
            window.alert(dialmsg[900] + t);
            return;
        }
    }
    if(!met_normal){
        window.alert(dialmsg[910]);
        return;
    }
    if(m){
        var ori = parse(document.getElementById('text_ori').value);
        var arr = parse(str, ori);
        var newstr = '';
        var oriBlk, emojiMap, comBlk;
        for(var i = 0; i < arr.length; i++){
            if(typeof(arr[i].key) == 'string'){
                oriBlk = valueParser(ori[parseInt(arr[i].num) - 1].text);
                emojiMap = getEmojiMap(oriBlk);
                comBlk = valueParser(arr[i].text);
                newstr = newstr + '- \u25CF - '+arr[i].num+' - \u25CF - ' + toEmoji(comBlk, emojiMap) + '\n';
            }
            else if(typeof(arr[i].group) == 'string'){
                newstr = newstr + '- \u25CB - '+arr[i].num+' - \u25CB - ' + arr[i].group + '\n';
            }
            else if(typeof(arr[i].empty) == 'string'){
                newstr = newstr + '- \u25C7 - 0 - \u25C7 - ' + arr[i].empty + '\n';
            }
        }
        if(newstr.length > 0){
            newstr = newstr.slice(0, -1);
        }
        dom_com.value = newstr;
    }
}catch(e){ew(e)}}

function attachkey(){try{
    var dom_com = document.getElementById('text_com');
    var spl_init = dom_com.value.replace(/\u200B/g, '').replace(/\r\n/g, '\n').replace(/\n+/g, '\n').split('\n').filter(function(s){if(!s.match(/^\s+$/)){return true;}});
    var reg = /^-\s?[\u25CF\u25CB\u25C7]\s?-\s?(\d+)\s?-\s?[\u25CF\u25CB\u25C7]\s?-\s*(.*)$/;
    var spl = [];
    var regn1 = new RegExp('^\\s*\u{1F4EF}\\s*$');
    var regn2 = new RegExp('^\u{1F4EF}.*$');
    var regn3 = new RegExp('\u{1F4EF}$');
    for(var i = 0; i < spl_init.length; i++){
        var t = spl_init[i];
        if(t.match(regn1)){
            spl[spl.length - 1] = spl[spl.length - 1] + '\u{1F4EF}';
        }
        else if(t.match(regn2)){
            spl[spl.length - 1] = spl[spl.length - 1] + t;
        }
        else if(t.match(reg)){
            spl.push(t);
        }
        else if(i > 0 && (spl_init[i - 1].match(regn1) || spl_init[i - 1].match(regn3))){
            spl[spl.length - 1] = spl[spl.length - 1] + t;
        }
        else{
            spl.push(t);
        }
    }
    var m = null;
    var str = '';
    var ori = parse(document.getElementById('text_ori').value);
    for(var i = 0; i < spl.length; i++){
        var t = spl[i];
        var lastline = '';
        m = t.match(reg);
        if(!m){
            window.alert(dialmsg[920] + t + dialmsg[970]);
            return;
        }
        if(parseInt(m[1]) > 0){
            for(var j = 0; j < ori.length; j++){
                if(ori[j].num == m[1]){
                    if(typeof(ori[j].key) == 'string'){
                        oriBlk = valueParser(ori[j].text);
                        emojiMap = getEmojiMap(oriBlk);
                        lastline = '\u25C0' + ori[j].num + '\u25B6' + ori[j].key + '=' + fromEmoji(m[2], emojiMap) + '\n'
                        if(lastline.match(emojiListTest)){
                            window.alert(dialmsg[960] + lastline);
                            return;
                        }
                        str = str + lastline;
                    }
                    else if(typeof(ori[j].group) == 'string'){
                        str = str + '\u25C0' + ori[j].num + '\u25B6[' + ori[j].group + ']\n';
                    }
                }
            }
        }
        else{
            str = str + '\u25C1' + (i+1) + '\u25B7' + m[2] + '\n';
        }
    }
    if(str.length > 0){
        dom_com.value = str.slice(0, -1);
    }
}catch(e){ew(e)}}

function mergecom2loc(){try{
    var ori = parse(document.getElementById('text_ori').value);
    var loc = parse(document.getElementById('text_loc').value, ori);
    var com = parse(document.getElementById('text_com').value, ori);
    if(window.confirm(dialmsg[930])){
        var newstr = '';
        var last_grp = '';
        var obj;
        var empty_before = '';
        for(var i = 0; i < ori.length; i++){
            obj = null;
            if(typeof(ori[i].empty) == 'string' || typeof(ori[i].key) != 'string'){
                continue;
            }
            for(var j = 0; j < loc.length; j++){
                if(typeof(loc[j].empty) == 'string' || typeof(loc[j].key) != 'string'){
                    continue;
                }
                if(
                    loc[j].num == ori[i].num
                    && loc[j].key == ori[i].key
                    && loc[j].group == ori[i].group
                ){
                    obj = Object.assign({}, loc[j]);
                    break;
                }
            }
            for(var j = 0; j < com.length; j++){
                if(typeof(com[j].empty) == 'string' || typeof(com[j].key) != 'string'){
                    continue;
                }
                if(
                    com[j].num == ori[i].num
                    && com[j].key == ori[i].key
                    && com[j].group == ori[i].group
                ){
                    obj = Object.assign({}, com[j]);
                    break;
                }
            }
            if(obj){
                if(obj.group != last_grp){
                    last_grp = obj.group;
                    empty_before = Array(obj.grp_ebef).fill('\n').join('');
                    newstr = newstr + empty_before + '[' + last_grp + ']\n';
                }
                empty_before = Array(obj.ebef).fill('\n').join('');
                newstr = newstr + empty_before + obj.key + '=' + obj.text + '\n';
            }
        }
        document.getElementById('text_com').value = newstr;
    }
}catch(e){ew(e)}}