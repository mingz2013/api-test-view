function post(url, params, cb) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify(params));
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            let json = httpRequest.responseText;
            console.log(json);
            cb(json);
        }
    };
}


function get(url, params, cb) {

    var request = new XMLHttpRequest();

    request.open("GET", url);

    request.onreadystatechange = function () {

        if (request.readyState !== 4) {

            return;

        }


        if (request.status === 200) {

            cb(JSON.parse(request.responseText));

        }

    };

    request.send(null);
}


function render_array(list) {

    let table = document.getElementById('result_table');
    table.innerHTML = "";
    let is_append_title = false;

    list.forEach(function (elem) {


        if (!is_append_title) {
            let tr = document.createElement('tr');
            for (let key in elem) {
                let elem_ = elem[key];
                let td = document.createElement('td');
                td.innerText = key;
                tr.appendChild(td);
            }


            table.appendChild(tr);

            is_append_title = true;
        }

        let tr = document.createElement('tr');

        for (let key in elem) {

            let elem_ = elem[key];
            let td = document.createElement('td');
            td.innerText = elem_;
            tr.appendChild(td);
        }
        table.appendChild(tr);


    })
}

function render_object(obj) {
    let table = document.getElementById('result_table');
    table.innerHTML = "";
    for (let key in obj) {
        let tr = document.createElement('tr');

        let td = document.createElement('td');
        td.innerText = key;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerText = obj[key];
        tr.appendChild(td);

        table.appendChild(tr);
    }
}

function query_api(uri, params) {

    get(uri, params, function (result) {

        console.log('query_api <<', result);

        if (Array.isArray(result)) {
            render_array(result)
        } else {
            render_object(result)
        }


    })
}


function create_select_option_node(value, txt) {
    let option = document.createElement('option');
    option.value = value;
    option.text = txt;
    return option;
}

function create_select() {

    let select_module_node = document.getElementById('select_module');

    select_module_node.onchange = function (value) {
        let index = select_module_node.selectedIndex;
        let module = select_module_node.options[index].value;

        let select_node = document.getElementById('select_uri');

        select_node.innerHTML = '<option value="">-----请选择接口-----</option>';

        let table = document.getElementById('result_table');
        table.innerHTML = "";

        if (module in module_list) {
            uri_list = module_list[module].uri_list;


            select_node.onchange = function (value) {
                console.log('select_node onchange', value);
                let index = select_node.selectedIndex;
                let uri = select_node.options[index].value;
                create_params(uri);

                let table = document.getElementById('result_table');
                table.innerHTML = "";

            }

            for (let key in uri_list) {
                let url_data = uri_list[key];
                select_node.appendChild(create_select_option_node(key, url_data.desc));
            }
        }
    }

    console.log('module_list', module_list);

    for (let key in module_list) {
        // console.log('key', key);
        let module_data = module_list[key];
        select_module_node.appendChild(create_select_option_node(key, module_data.desc));
    }


}


function create_params(uri) {
    console.log('create params', uri);
    let params_node = document.getElementById('params');
    params_node.innerHTML = "";

    if (uri in uri_list) {
        let uri_obj = uri_list[uri];

        let params = uri_obj.params;


        for (let index in params) {
            let obj = params[index];
            console.log('obj', obj);


            let tr = document.createElement('tr');

            let td = document.createElement('td');
            td.innerText = obj.desc;
            tr.appendChild(td);

            td = document.createElement('td');
            if (obj.view_type === 'text') {
                let node = document.createElement('input');
                node.id = obj.key;
                node.defaultValue = obj.default;
                td.appendChild(node);
            } else if (obj.view_type === 'textarea') {

                let node = document.createElement('textarea');
                node.id = obj.key;

                node.defaultValue = obj.default;
                td.appendChild(node);

            } else if (obj.view_type === 'select') {
                let node = document.createElement('select');

                node.id = obj.key;

                for (let index_ in obj.select_options) {
                    node.appendChild(create_select_option_node(obj.select_options[index_].value, obj.select_options[index_].desc));
                }
                td.appendChild(node);


            } else if (obj.view_type === 'datetime-local') {
                let node = document.createElement('input');
                node.type = 'datetime-local';
                node.id = obj.key;
                td.appendChild(node);

            } else {
                console.error('unexcept type');

            }
            tr.appendChild(td);

            params_node.appendChild(tr);
        }
    }


}


function collect_params(uri) {
    let url_obj = uri_list[uri];

    let params = url_obj.params;

    let result = {};

    for (let index in params) {
        let obj = params[index];
        let node = document.getElementById(obj.key);

        if (obj.view_type === 'text') {
            let txt = node.innerText;
            result[obj.key] = txt;
        } else if (obj.view_type === 'textarea') {
            let txt = node.innerText;
            result[obj.key] = txt;
        } else if (obj.view_type === 'select') {
            let select_index = node.selectedIndex;
            result[obj.key] = node.options[select_index].value;

        } else if (obj.view_type === 'datetime-local') {
            result[obj.key] = node.value;

        } else {
            console.error('unexcept type')
        }

    }

    return result;

}


var uri_list = {};

var module_list = {}


window.onload = function () {
    document.getElementById('query_btn').onclick = function () {


        let select_node = document.getElementById('select_uri');

        let index = select_node.selectedIndex;
        let uri = select_node.options[index].value;

        let params = collect_params(uri);

        query_api(uri, params)
    }

    get('./api/models.json', {}, function (result) {
        console.log(result);
        module_list = result;
        create_select();

    })
}