var tb = [];
var hashTable = [];
var len;
var a;
var b;
var p = 999999999999989;        // prime
var pBig = BigInt(p);
var m;
var done = false;

async function getData(){
  //console.log("ss");
  var table;
  await fetch('E2Bdatabase.json')
      .then(response => response.text())
      .then(data => {
        table = JSON.parse(data);
      })
  len = table.length;
  //console.log(len);
  tb = [];
  let mp = new Map();               // using map to check for duplicates
  for (i = 0; i < len; ++i) {
      if (mp.get(table[i].en) == undefined) {
        tb.push(table[i]);
        mp.set(table[i].en, 1);
      }
  }
  len = tb.length;
  //console.log(len);
  a = BigInt(1+Math.floor((Math.random()*p-1)));
  b = BigInt(Math.floor((Math.random()*p)));
  m = BigInt(len);
  var tempList =[];
  var maxn = 0;
  var cnt0 = 0;
  for (i = 0; i < len; ++i) {
    tempList[i] = [];
  }
  for (i = 0; i < len; ++i) {
    var k = 0n;
    var l = tb[i].en.length;
    for (j = 0; j < l; ++j) {
      k = (k*257n+BigInt(tb[i].en.charCodeAt(j))+1n)%pBig;
    }
    var slot = ((a*k+b)%pBig)%m;
    tempList[slot].push({key : k, index : i});
  }                                                                                                         
  for (i = 0; i < len; ++i) {
    var len2 = tempList[i].length;
    if (len2 == 0) continue;
    var m2 = BigInt(len2*len2);
    while(true) {
      var a2 = BigInt(1+Math.floor((Math.random()*p-1)));
      var b2 = BigInt(Math.floor((Math.random()*p)));
      var cnt = 0;
      var tb2 = new Array(Number(m2));
      for (j = 0; j < len2; ++j) {
        var slot = ((a2*tempList[i][j].key+b2)%pBig)%m2;
        if (tb2[slot] == undefined) ++cnt;
        tb2[slot] = tempList[i][j];
      }
      if (cnt == len2) {
        hashTable[i] = {a : a2, b : b2, m : m2, tb : tb2};
        break;
      }
    }
  }
  done = true;
  console.log("done"); 
}
getData();

document.getElementById("in").addEventListener("input", myfunction);
function myfunction() {
  var x = document.getElementById("in").value;
  if (x == "") {
    document.getElementById("out").innerHTML = '';
  }
  else {
    document.getElementById("out").innerHTML = '';
    if (!done) return;
    x = x.trim();
    x = x.toLowerCase();
    var k = 0n;
    for (i = 0; i < x.length; ++i) {
      k = (k*257n+BigInt(x.charCodeAt(i))+1n)%pBig;
    }
    var slot1 = ((a*k+b)%pBig)%m;
    if (hashTable[slot1] == undefined) {
      document.getElementById('out').innerHTML = "Not found";
      return;
    }
    var a2 = hashTable[slot1].a;
    var b2 = hashTable[slot1].b;
    var m2 = hashTable[slot1].m;
    var slot2 = ((a2*k+b2)%pBig)%m2;
    if (hashTable[slot1].tb[slot2] == undefined) {
      document.getElementById('out').innerHTML = "Not found";
      return;
    }
    var index = hashTable[slot1].tb[slot2].index;
    console.log(tb[index].en);
    if (tb[index].en != x) {
      document.getElementById('out').innerHTML = "Not found";
      return;
    }
    var li = document.createElement('li');
    li.textContent = tb[index].bn;
    document.getElementById('out').appendChild(li); 
  }
}
