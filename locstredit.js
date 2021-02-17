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
    930: 'msg: 930\n"비교" 영역의 텍스트가 변경되며 되돌릴 수 없습니다. 계속하시겠습니까?'
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
    930: 'msg: 930\nTexts in "compare" section will be changed irreversible. Are you sure to continue?'
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
    str = str.replaceAll(/​/g, '').replaceAll('\r\n', '\n');
    var spl = str.split('\n');
    var reg0 = /^[◀◁]\s?(\d+)\s?[▶▷]\s?(.*)$/;
    var reg1 = /^\[([a-zA-Z0-9\-_]+)\]\s*$/;
    var reg2 = /^([a-zA-Z0-9\-_]+)=(.*)$/;
    var m = null;
    var last_grp = '';
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
            arr.push({num : n, key : m[1], text : m[2], group : last_grp});
        }
        else{
            m = t.match(reg1);
            if(m){
                last_grp = m[1];
                arr.push({num : n, group : last_grp});
            }
            else{
                last_grp = '';
                arr.push({num : n, empty : t});
            }
        }
        if(typeof(obj_oriarr) == 'object' && typeof(arr[arr.length-1].empty) != 'string'){
            var lastitem = arr[arr.length-1];
            var found = false;
            for(var j = 0; j < obj_oriarr.length; j++){
                if(obj_oriarr[j].key == lastitem.key && obj_oriarr[j].group == lastitem.group){
                    arr[arr.length-1].num = obj_oriarr[j].num;
                    found = true;
                    break;
                }
            }
            if(!found){
                arr[arr.length-1].num = 0;
            }
        }
    }
    return arr;
}catch(e){ew(e)}}

function recompose(obj_arr, bool_tagnum){try{
    var str = '';
    for(var i = 0; i < obj_arr.length; i++){
        if(typeof(obj_arr[i].key) == 'string'){
            str = str + ((bool_tagnum)? '◀'+obj_arr[i].num+'▶' : '') + obj_arr[i].key + '=' + obj_arr[i].text + '\n';
        }
        else if(typeof(obj_arr[i].group) == 'string'){
            str = str + ((bool_tagnum)? '◀'+obj_arr[i].num+'▶' : '') + '[' + obj_arr[i].group + ']\n';
        }
        else if(typeof(obj_arr[i].empty) == 'string'){
            str = str + ((bool_tagnum)? '◁'+obj_arr[i].num+'▷' : '') + obj_arr[i].empty + '\n';
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
        var conf = window.confirm('"compare" section is not empty. Do you really discard its contents?');
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
        var ori = parse(document.getElementById('text_ori').value);
        var loc = parse(document.getElementById('text_loc').value, ori);
        var last_grp = '';
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
                            newstr = newstr + '\n[' + last_grp + ']\n';
                        }
                        newstr = newstr + ori[i].key + '=' + loc[j].text + '\n';
                    }
                    break;
                }
            }
            if(work == 1 && !found){
                if(ori[i].group != last_grp){
                    last_grp = ori[i].group;
                    newstr = newstr + '\n[' + last_grp + ']\n';
                }
                newstr = newstr + ori[i].key + '=' + ori[i].text + '\n';
            }
        }
        if(newstr[0] == '\n'){newstr = newstr.slice(1)}
        document.getElementById('text_com').value = recompose(parse(newstr), false);
    }
}catch(e){ew(e)}}

function detachkey(){try{
    var dom_com = document.getElementById('text_com');
    var str = dom_com.value.replaceAll(/​/g, '').replaceAll('\r\n', '\n');
    var spl = str.split('\n');
    var reg = /^([◀◁])\s?(\d+)\s?([▶▷])\s?.*$/;
    var m = null;
    var met_normal = false;
    for(var i = 0; i < spl.length; i++){
        var t = spl[i];
        m = t.match(reg);
        if(m){
            if(m[1] == '◀' && parseInt(m[2]) > 0 && m[3] == '▶'){
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
        for(var i = 0; i < arr.length; i++){
            if(typeof(arr[i].key) == 'string'){
                newstr = newstr + '●'+arr[i].num+'●' + arr[i].text + '\n';
            }
            else if(typeof(arr[i].group) == 'string'){
                newstr = newstr + '○'+arr[i].num+'○' + arr[i].group + '\n';
            }
            else if(typeof(arr[i].empty) == 'string'){
                newstr = newstr + '◇0◇' + arr[i].empty + '\n';
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
    var spl = dom_com.value.replaceAll(/​/g, '').replaceAll('\r\n', '\n').split('\n');
    var reg = /^[●○◇]\s?(\d+)\s?[●○◇]\s?(.*)$/;
    var m = null;
    var str = '';
    var ori = parse(document.getElementById('text_ori').value);
    for(var i = 0; i < spl.length; i++){
        var t = spl[i];
        m = t.match(reg);
        if(!m){
            window.alert(dialmsg[920] + t);
            return;
        }
        if(parseInt(m[1]) > 0){
            for(var j = 0; j < ori.length; j++){
                if(ori[j].num == m[1]){
                    if(typeof(ori[j].key) == 'string'){
                        str = str + '◀' + ori[j].num + '▶' + ori[j].key + '=' + m[2] + '\n';
                    }
                    else if(typeof(ori[j].group) == 'string'){
                        str = str + '◀' + ori[j].num + '▶[' + ori[j].group + ']\n';
                    }
                }
            }
        }
        else{
            str = str + '◁' + (i+1) + '▷' + m[2] + '\n';
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
                    obj = {key : loc[j].key, text : loc[j].text, group : loc[j].group};
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
                    obj = {key : com[j].key, text : com[j].text, group : com[j].group};
                    break;
                }
            }
            if(obj){
                if(obj.group != last_grp){
                    last_grp = obj.group;
                    newstr = newstr + '\n[' + last_grp + ']\n';
                }
                newstr = newstr + obj.key + '=' + obj.text + '\n';
            }
        }
        if(newstr[0] == '\n'){newstr = newstr.slice(1)}
        document.getElementById('text_com').value = newstr;
    }
}catch(e){ew(e)}}