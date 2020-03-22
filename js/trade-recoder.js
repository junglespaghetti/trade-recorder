function startMain(){
    var htmlContents = '<div id="easyIndexedDB-contents" style="margin:4px;pedding:4px;font-size: small;">\
    <style>#easyIndexedDB-contents p{ margin:5px;}</style>\
    <ul id="easyIndexedDB-pages" style="list-style:">\
        <li id="easyIndexedDb-edit-form">\
            <h3>Easy IndexedDB</h3>\
            <p>DB Name : <input id="easyIndexedDB-DB-name" style="margin:1px;pedding:1px;"></p>\
            <p>Version : <span id="easyIndexedDB-version"></span></p>\
            <p>Origin url : <span id="easyIndexedDB-origin-url"></span></p>\
            <p><button id="easyIndexedDB-add-button" type="button">Add Table</button> Table name: Columns(Comma separated)</p>\
            <ol id="easyIndexedDB-table-list" style="padding-left: 20px;margin-top: 8px;">\
                <li>\
                    <input style="width:80px;"> : <input><span style="margin-left: 8px"><i class="fas fa-times"></i></span>\
                </li>\
            </ol>\
            <p style="margin-top: 8px"><button id="easyIndexedDB-apply-button" type="button">Apply</button></p>\
        </li>\
    </ul>\
</div>\
'
alert(htmlContents);
    var easyIndexedDB = jsPanel.create({
        headerTitle: 'Easy IbdexedDB',
        position:    'center-top 0 80',
        contentSize: '450 250',
        content:htmlContents,
        headerLogo:'<input type="text" id="db-input" list="db-list" placeholder="input DB name" autocomplete="off" style="margin-left:8px;font-size:10pt;"><datalist id="db-list"></datalist>',
        headerToolbar: '<input type="text" id="table-input" list="table-list" placeholder="input Table name" autocomplete="off" style="font-size:10pt;"><datalist id="table-list"></datalist>' +
                    '<div style="margin-left:8px;">' +               
                    '<span id="bus"><i class="fas fa-file-import fa-lg"></i></span>'+
                    '<span id="train"><i class="fas fa-file-download fa-lg"></i></span>'+
                    '<span id="car"><i class="fas fa-hand-holding-usd fa-lg"></i></span>'+
                    '<span id="car"><i class="fas fa-money-check-alt fa-lg"></i></span>'+
                    '<span id="car"><i class="fas fa-chart-line fa-lg"></i></span>'+
                    '<span id="bicycle"><i class="fas fa-calculator fa-lg"></i></span>' +
                    '</div>',
        callback: function (panel) {
            Dexie.exists("easyIndexedDB").then(function(exists){
                let eDB = new Dexie("easyIndexedDB");
                let tableData = {
                    dbList: "++id, name, version, table ",
                    settings: "name, value"
                };
                eDB.version(1).stores(tableData);
                if(!exists){
                    eDB.dbList.put({name:"easyIndexedDB",version:1,table:JSON.stringify(tableData)});
                    eDB.settings.put({name:"status",value:"new"});
                }
                eDB.dbList.toArray().then(function(data) {
                    let dataList = document.getElementById("db-list");
                    data.forEach(function(val){
                        let option = document.createElement("option");
                        option.text = val.name;
                        option.value = val.name;
                        dataList.appendChild(option);
                    })
                });
            });
            let dbInput = document.getElementById("db-input");
            dbInput.addEventListener('change',function (event){selectDB(event)});
            dbInput.addEventListener('click',function (event){dbInput.value=""});
            let tableInput = document.getElementById("table-input");
            tableInput.addEventListener('change',function (event){selectTable(event)});
            tableInput.addEventListener('click',function (event){tableInput.value=""});
            let dbOrigin = document.getElementById("easyIndexedDB-origin-url");
            dbOrigin.innerHTML = location.hostname;
                this.headertoolbar.querySelectorAll('span').forEach(function(item) {
                    item.style.cursor = 'pointer';
                    item.style.marginRight = '4px';
                    item.addEventListener('click', function() {
                    panel.content.innerHTML = 'You clicked the ' + item.id + ' icon!';
                }); 
            });
        }
    })
}
function createEasyIndexedDB(){
    let eDB = new Dexie("easyIndexedDB");
    eDB.version(1).stores({
        dbList: "++id, name, version, table ",
        settings: "name, value"
     });
    return eDB
}


function selectDB(event){
    if(event.target.value){
        let eDB = createEasyIndexedDB();
        eDB.dbList.where('name').equalsIgnoreCase(event.target.value).toArray().then(function(arr){
            if(arr.length == 0){
            alert("aaa");
            }else if(arr.length == 1){
            let tableList = document.getElementById("table-list");
            let tableData = JSON.parse(arr[0]["table"]);
            let tableInput = document.getElementById("table-input");
            let dbNameInput = document.getElementById("easyIndexedDB-DB-name");
            let dbversion = document.getElementById("easyIndexedDB-version");
            let tableOl = document.getElementById("easyIndexedDB-table-list");
            tableInput.value = "";
            dbNameInput.value = event.target.value;
            dbversion.innerHTML = arr[0]["version"]
                while (tableList.firstChild) {
                tableList.removeChild(tableList.firstChild);
                }
                while (tableOl.firstChild) {
                tableOl.removeChild(tableOl.firstChild);
                }
                Object.keys(tableData).forEach(function (key) {
                    let option = document.createElement("option");
                    option.text = key;
                    option.value = key;
                    tableList.appendChild(option);
                    let li = document.createElement("li");
                    let input = document.createElement("input");
                    li.appendChild(input);
                    li.appendChild(input);
                    let span = document.createElement("span");
                    let i = document.createElement("i");
                    span.appendChild(i);
                    li.appendChild(span);
                    tableList.appendChild(li);
                })  
            }
        });
    }
}

function selectTable(event){
    let dbInput = document.getElementById("db-input").value;
    if(event.target.value && dbInput){
        let eDB = createEasyIndexedDB();
        eDB.dbList.where('name').equalsIgnoreCase(dbInput).toArray().then(function(arr){
            if(arr.length == 0){
                alert("aaa");
            }else if(arr.length == 1){
                let tableList = document.getElementById("table-list");
                let tableData = JSON.parse(arr[0]["table"]);
                if (Object.keys(tableData).includes(event.target.value)) {
            
                }else{

                }
            }
        });
    }
}

async function getRecorderDB(){

var db = new Dexie(recorderDBName);
let openRequest = indexedDB.open(recorderDBName, 1)
openRequest.onupgradeneeded = function() {
  let db2 = openRequest.result;
  alert(db2.version);
};
db.version(1).stores({
    friends: `name, age`
})
await db.friends.add({ name: "test", age: "test note" });

var opt = {
  delimiter: "<>"
};
alert("aaa");

db.friends.toArray().then(function(data) {
  alert(Papa.unparse(data, opt));
});
    
}

function iniEasyIdexedDB(){
    alert("aaa");
Dexie.exists("easyIndexedDB").then(function(exists){
    var eDB = new Dexie("easyIndexedDB");
    if(!exists){
        eDB.version(1).stores({
        dbList: "++id, name, version, table ",
        settings: "name, value"
        });
        eDB.dbList.add({name:"easyIndexedDB",version:1,table:["dbList","settings"]});
        eDB.settings.add({name:"status",value:"new"});
    }else{
        eDB.version(1).open();
    }
eDB.dbList.toArray().then(function(data) {
    let dataList = document.getElementById("db-list");
    
    data.forEach(function(val){
        let option = document.createElement("option");
        option.text = val.name;
        option.value = val.name;
        dataList.appendChild(option);
    })
});
});
}


function createFrame(){

 jsPanel.create({
    headerTitle: 'host:' + location.hostname,
    position:    'center-top 0 58',
    contentSize: '450 250',
    headerLogo:'<input type="text" id="db-input" list="db-list" placeholder="input DB name" autocomplete="off" style="margin-left:8px;font-size:8pt;"><datalist id="db-list"><option value="this db"></datalist>',
    headerToolbar: '<input type="text" id="table-input" list="table-list" placeholder="input Table name" autocomplete="off" style="font-size:8pt;"><datalist id="table-list"><option value="table"></datalist>' +
                    '<div style="margin-left:8px;">' +               
                    '<span id="bus"><i class="fas fa-file-import fa-lg"></i></i></span>'+
                   '<span id="train"><i class="fas fa-file-download fa-lg"></i></span>'+
                    '<span id="car"><i class="fas fa-hand-holding-usd fa-lg"></i></span>'+
                 '<span id="car"><i class="fas fa-money-check-alt fa-lg"></i></span>'+
                 '<span id="car"><i class="fas fa-chart-line fa-lg"></i></span>'+
                 '<span id="bicycle"><i class="fas fa-calculator fa-lg"></i></span>' +
                 '</div>',
  callback: function (panel) {
      Dexie.exists("easyIndexedDB").then(function(exists){
    var eDB = new Dexie("easyIndexedDB");
    
    eDB.version(1).stores({
        dbList: "++id, name, version, table ",
        settings: "name, value"
        });
    if(!exists){
   eDB.dbList.put({name:"easyIndexedDB",version:1,table:["dbList","settings"]});
        eDB.settings.put({name:"status",value:"new"});
    }
    
eDB.dbList.toArray().then(function(data) {
    let dataList = document.getElementById("db-list");
    data.forEach(function(val){
        let option = document.createElement("option");
        option.text = val.name;
        option.value = val.name;
        dataList.appendChild(option);
    })
});
});
let dataInput = document.getElementById("db-input");
    dataInput.addEventListener('change',function (event){selectDB(event)});
    this.headertoolbar.querySelectorAll('span').forEach(function(item) {
      item.style.cursor = 'pointer';
      item.style.marginRight = '4px';
      item.addEventListener('click', function() {
        panel.content.innerHTML = 'You clicked the ' + item.id + ' icon!';
      });
    });
  }
});
}